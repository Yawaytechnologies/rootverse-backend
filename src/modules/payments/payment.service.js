import crypto from "node:crypto";
import db from "../../shared/lib/db.js";
import * as repo from "./payment.repository.js";

const PAYMENT_MODES = ["NEFT", "RTGS", "IMPS", "UPI", "CHEQUE", "CASH", "OTHER"];
const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const error = (message, statusCode = 400, details = null) =>
  Object.assign(new Error(message), { statusCode, details });

const positiveId = (value, name = "id") => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw error(`Valid ${name} is required`);
  return id;
};

const positiveNumber = (value, name) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) throw error(`${name} must be greater than zero`);
  return number;
};

const traderIdFor = (user, supplied) => {
  if (user?.role === "TRADER_ADMIN") return positiveId(user.trader_id || user.id, "trader_id");
  return positiveId(supplied, "trader_id");
};

const financialYear = (date = new Date()) => {
  const year = date.getUTCFullYear();
  const start = date.getUTCMonth() >= 3 ? year : year - 1;
  return `${String(start).slice(-2)}-${String(start + 1).slice(-2)}`;
};

const procurementNo = (id, date) => `PROC-${String(date.getUTCFullYear()).slice(-2)}-${String(id).padStart(5, "0")}`;
const paymentNo = (id, date) => `PAY-${String(date.getUTCFullYear()).slice(-2)}-${String(id).padStart(6, "0")}`;
const receiptNo = (id, date) => `PAY/PR/${financialYear(date)}/${String(id).padStart(6, "0")}`;

const parseSnapshot = (value) => (typeof value === "string" ? JSON.parse(value) : value);

const ensureTraderOwnership = (row, traderId) => {
  if (Number(row.trader_id) !== Number(traderId)) throw error("Record does not belong to this trader", 403);
};

const buildCompletionProgress = (harvest, workflow) => {
  const inspections = workflow.qualityInspections;
  const checkedInspections = inspections.filter((row) => row.inspection_status === "CHECKED");
  const packedCrates = workflow.packedCrates;
  const transportedCrates = packedCrates.filter((row) => row.transport_loading_id);
  const packedWeight = packedCrates.reduce((sum, row) => sum + Number(row.weight_kg || 0), 0);
  const transportedWeight = transportedCrates.reduce((sum, row) => sum + Number(row.weight_kg || 0), 0);

  const qualityCompleted = checkedInspections.length > 0;
  const packingCompleted = packedCrates.length > 0;
  const transportationCompleted = packingCompleted && transportedCrates.length === packedCrates.length;
  const canComplete = harvest.booking_status === "booked" && qualityCompleted && packingCompleted && transportationCompleted;

  return {
    harvest,
    progress: {
      can_complete_harvest: canComplete,
      harvest_status: harvest.harvest_status,
      booking_status: harvest.booking_status,
      completion_percentage: [qualityCompleted, packingCompleted, transportationCompleted].filter(Boolean).length * 33 + (transportationCompleted ? 1 : 0),
      pending_stages: [
        !qualityCompleted ? "QUALITY_CHECKING" : null,
        !packingCompleted ? "CRATE_PACKING" : null,
        !transportationCompleted ? "TRANSPORTATION" : null,
      ].filter(Boolean),
      quality_checking: {
        completed: qualityCompleted,
        total_inspections: inspections.length,
        checked_inspections: checkedInspections.length,
        inspections,
      },
      crate_packing: {
        completed: packingCompleted,
        total_crates_packed: packedCrates.length,
        total_packed_weight_kg: packedWeight,
        crates: packedCrates,
      },
      transportation: {
        completed: transportationCompleted,
        total_crates_to_transport: packedCrates.length,
        total_crates_transported: transportedCrates.length,
        remaining_crates: Math.max(packedCrates.length - transportedCrates.length, 0),
        total_transported_weight_kg: transportedWeight,
        transport_details: transportedCrates,
      },
    },
  };
};

export async function getHarvestCompletionProgress(harvestIdValue, suppliedTraderId, user) {
  const harvestId = positiveId(harvestIdValue, "harvest_id");
  const traderId = traderIdFor(user, suppliedTraderId);
  const harvest = await repo.findHarvestForPayment(harvestId);
  if (!harvest) throw error("Harvest not found", 404);
  ensureTraderOwnership(harvest, traderId);
  return buildCompletionProgress(harvest, await repo.getHarvestCompletionWorkflow(harvestId));
}

export async function completeHarvest(harvestIdValue, body, user) {
  const harvestId = positiveId(harvestIdValue, "harvest_id");
  const traderId = traderIdFor(user, body.trader_id);
  const actualWeight = positiveNumber(body.actual_harvest_weight_kg, "actual_harvest_weight_kg");
  return db.transaction(async (trx) => {
    const harvest = await repo.findHarvestForPayment(harvestId, trx, true);
    if (!harvest) throw error("Harvest not found", 404);
    ensureTraderOwnership(harvest, traderId);
    if (harvest.booking_status !== "booked") throw error("Harvest must be booked before completion", 422);
    const completionDetails = buildCompletionProgress(
      harvest,
      await repo.getHarvestCompletionWorkflow(harvestId, trx)
    );
    if (harvest.harvest_status === "COMPLETED") return completionDetails;
    if (!completionDetails.progress.can_complete_harvest) {
      throw error(
        `Harvest cannot be completed. Pending stages: ${completionDetails.progress.pending_stages.join(", ")}`,
        422,
        completionDetails
      );
    }
    const completedAt = body.completed_at ? new Date(body.completed_at) : new Date();
    if (Number.isNaN(completedAt.getTime())) throw error("completed_at must be a valid date");
    const [updated] = await repo.completeHarvest(harvestId, {
      harvest_status: "COMPLETED",
      completed_at: completedAt,
      actual_harvest_weight_kg: actualWeight,
      completed_by_role: user.role,
      completed_by_id: String(user.id),
      updated_at: new Date(),
    }, trx);
    const completedHarvest = { ...harvest, ...updated };
    return buildCompletionProgress(
      completedHarvest,
      await repo.getHarvestCompletionWorkflow(harvestId, trx)
    );
  });
}

export async function createProcurement(body, user) {
  const harvestId = positiveId(body.harvest_id, "harvest_id");
  const traderId = traderIdFor(user, body.trader_id);
  const rate = positiveNumber(body.rate_per_kg, "rate_per_kg");
  return db.transaction(async (trx) => {
    const existing = await repo.findProcurementByHarvest(harvestId, trx);
    if (existing) return hydrateProcurement(existing, trx);
    const harvest = await repo.findHarvestForPayment(harvestId, trx, true);
    if (!harvest) throw error("Harvest not found", 404);
    ensureTraderOwnership(harvest, traderId);
    if (harvest.harvest_status !== "COMPLETED") throw error("Harvest must be completed before procurement", 422);
    if (!harvest.user_id) throw error("Harvest producer user is missing", 422);
    const weight = positiveNumber(harvest.actual_harvest_weight_kg, "actual_harvest_weight_kg");
    const gross = roundMoney(weight * rate);
    const adjustment = roundMoney(body.adjustment_amount || 0);
    const tax = roundMoney(body.tax_amount || 0);
    const total = roundMoney(gross + adjustment + tax);
    if (total <= 0) throw error("total_value must be greater than zero");
    const traderSnapshot = {
      trader_id: harvest.trader_code, name: harvest.trader_name, address: harvest.trader_address,
      phone: harvest.trader_phone, email: harvest.trader_email, gstin: body.trader_gstin || null,
      company_logo_url: harvest.company_logo_url || null, authorized_signatory: body.authorized_signatory || harvest.trader_name,
    };
    const producerSnapshot = {
      producer_id: harvest.producer_code, name: harvest.producer_name, farm_name: harvest.farm_name,
      farm_code: harvest.farm_code, address: harvest.farm_address || harvest.producer_address,
      phone: harvest.producer_phone, email: harvest.producer_email || body.producer_email || null,
    };
    const date = body.procurement_date ? new Date(body.procurement_date) : new Date(harvest.completed_at || Date.now());
    if (Number.isNaN(date.getTime())) throw error("procurement_date must be a valid date");
    const [created] = await repo.insertProcurement({
      harvest_id: harvestId, trader_id: traderId, producer_user_id: harvest.user_id, procurement_date: date,
      actual_weight_kg: weight, rate_per_kg: rate, gross_amount: gross, adjustment_amount: adjustment,
      tax_amount: tax, total_value: total, payment_terms: body.payment_terms || null, status: "CONFIRMED",
      trader_snapshot: traderSnapshot, producer_snapshot: producerSnapshot,
    }, trx);
    const [numbered] = await repo.updateProcurement(created.id, { procurement_no: procurementNo(created.id, date) }, trx);
    return hydrateProcurement(numbered, trx);
  });
}

async function hydrateProcurement(procurement, trx) {
  const payments = await repo.listConfirmedPayments(procurement.id, trx);
  const totalPaid = roundMoney(payments.reduce((sum, row) => sum + Number(row.amount), 0));
  return {
    ...procurement,
    trader_snapshot: parseSnapshot(procurement.trader_snapshot), producer_snapshot: parseSnapshot(procurement.producer_snapshot),
    total_paid: totalPaid, outstanding_balance: roundMoney(Number(procurement.total_value) - totalPaid), payments,
  };
}

export async function createPayment(procurementIdValue, body, user, idempotencyHeader) {
  const procurementId = positiveId(procurementIdValue, "procurement_id");
  const amount = roundMoney(positiveNumber(body.amount, "amount"));
  const mode = String(body.payment_mode || "").trim().toUpperCase();
  if (!PAYMENT_MODES.includes(mode)) throw error(`payment_mode must be one of: ${PAYMENT_MODES.join(", ")}`);
  const idempotencyKey = String(idempotencyHeader || body.idempotency_key || "").trim() || null;
  return db.transaction(async (trx) => {
    const duplicate = await repo.findPaymentByIdempotencyKey(idempotencyKey, trx);
    if (duplicate) {
      const existingReceipt = await trx("payment_receipts").where({ payment_id: duplicate.id }).first();
      return { payment: duplicate, receipt: existingReceipt, idempotent_replay: true };
    }
    const procurement = await repo.findProcurement(procurementId, trx, true);
    if (!procurement) throw error("Procurement not found", 404);
    const traderId = traderIdFor(user, body.trader_id);
    ensureTraderOwnership(procurement, traderId);
    if (!["CONFIRMED", "PARTIALLY_PAID"].includes(procurement.status)) throw error("Procurement does not accept payments", 422);
    const paidBefore = roundMoney(await repo.sumConfirmedPayments(procurementId, trx));
    const outstandingBefore = roundMoney(Number(procurement.total_value) - paidBefore);
    if (amount > outstandingBefore) throw error(`Payment exceeds outstanding balance ${outstandingBefore}`, 409);
    const paidAt = body.paid_at ? new Date(body.paid_at) : new Date();
    if (Number.isNaN(paidAt.getTime())) throw error("paid_at must be a valid date");
    const [createdPayment] = await repo.insertPayment({
      procurement_id: procurementId, trader_id: traderId, producer_user_id: procurement.producer_user_id,
      amount, payment_mode: mode, bank_reference: body.bank_reference || null, bank_name: body.bank_name || null,
      account_holder_name: body.account_holder_name || null, paid_at: paidAt, status: "CONFIRMED",
      remarks: body.remarks || `Payment against ${procurement.procurement_no}`, idempotency_key: idempotencyKey,
      created_by_role: user.role, created_by_id: String(user.id),
    }, trx);
    const [payment] = await repo.updatePayment(createdPayment.id, { payment_no: paymentNo(createdPayment.id, paidAt) }, trx);
    const paidAfter = roundMoney(paidBefore + amount);
    const outstanding = roundMoney(Number(procurement.total_value) - paidAfter);
    await repo.updateProcurement(procurementId, { status: outstanding === 0 ? "PAID" : "PARTIALLY_PAID", updated_at: new Date() }, trx);
    const history = await repo.listConfirmedPayments(procurementId, trx);
    const verificationToken = crypto.randomBytes(24).toString("hex");
    const [receiptDraft] = await repo.insertReceipt({
      payment_id: payment.id, procurement_id: procurementId, verification_token: verificationToken,
      snapshot: { procurement, trader: parseSnapshot(procurement.trader_snapshot), producer: parseSnapshot(procurement.producer_snapshot), payment, paid_before: paidBefore, paid_after: paidAfter, outstanding_balance: outstanding, payment_history: history },
    }, trx);
    const number = receiptNo(receiptDraft.id, paidAt);
    const snapshot = { ...parseSnapshot(receiptDraft.snapshot), receipt_no: number, generated_at: new Date().toISOString(), verification_token: verificationToken };
    const [receipt] = await repo.updateReceipt(receiptDraft.id, { receipt_no: number, snapshot }, trx);
    return { payment, receipt: { ...receipt, snapshot }, idempotent_replay: false };
  });
}

const accessFilters = async (user, suppliedTraderId) => {
  if (user.role === "TRADER_ADMIN") return { trader_id: positiveId(user.trader_id || user.id) };
  if (user.role === "OWNER") {
    const producer = await repo.findProducerUserByOwnerCode(user.id);
    if (!producer) throw error("Producer user not found", 404);
    return { producer_user_id: producer.id };
  }
  return suppliedTraderId ? { trader_id: positiveId(suppliedTraderId, "trader_id") } : {};
};

export async function listProcurements(query, user) {
  const rows = await repo.listProcurements(await accessFilters(user, query.trader_id));
  return Promise.all(rows.map((row) => hydrateProcurement(row)));
}

export async function listReceipts(query, user) {
  return repo.listReceipts(await accessFilters(user, query.trader_id));
}

export async function getReceipt(receiptIdValue, user) {
  const receipt = await repo.findReceipt(positiveId(receiptIdValue, "receipt_id"));
  if (!receipt) throw error("Payment receipt not found", 404);
  const filters = await accessFilters(user);
  if (filters.trader_id && Number(receipt.trader_id) !== Number(filters.trader_id)) throw error("Payment receipt not found", 404);
  if (filters.producer_user_id && Number(receipt.producer_user_id) !== Number(filters.producer_user_id)) throw error("Payment receipt not found", 404);
  return { ...receipt, snapshot: parseSnapshot(receipt.snapshot) };
}

export async function verifyReceipt(token) {
  const receipt = await repo.findReceiptByToken(String(token || "").trim());
  if (!receipt) throw error("Payment receipt not found", 404);
  const snapshot = parseSnapshot(receipt.snapshot);
  return { valid: true, receipt_no: receipt.receipt_no, procurement_no: snapshot.procurement.procurement_no, trader_name: snapshot.trader.name, producer_name: snapshot.producer.name, amount: snapshot.payment.amount, payment_date: snapshot.payment.paid_at, payment_mode: snapshot.payment.payment_mode, bank_reference: snapshot.payment.bank_reference, outstanding_balance: snapshot.outstanding_balance };
}

export { parseSnapshot };
