import db from "../../shared/lib/db.js";

export const getExecutor = (trx) => trx || db;

export const findHarvestForPayment = async (harvestId, trx, forUpdate = false) => {
  const executor = getExecutor(trx);

  // PostgreSQL cannot apply an unrestricted FOR UPDATE to a query containing
  // LEFT JOINs because the joined rows can be null. Lock only the underlying
  // harvest row first, then fetch its related display data without a lock.
  if (forUpdate) {
    await executor("aquaculture_harvests")
      .select("id")
      .where({ id: harvestId })
      .forUpdate()
      .first();
  }

  return executor("aquaculture_harvests as ah")
    .leftJoin("culture_cycles as cc", "ah.culture_id", "cc.id")
    .leftJoin("farms as f", "cc.farm_id", "f.id")
    .leftJoin("rootverse_users as ru", "ah.user_id", "ru.id")
    .leftJoin("aquaculture_farmers as af", "ru.id", "af.user_id")
    .leftJoin("traders as t", "ah.trader_id", "t.id")
    .where("ah.id", harvestId)
    .select(
      "ah.*", "cc.farm_id", "f.farm_id as farm_code", "f.farm_name", "f.address as farm_address",
      "ru.username as producer_name", "ru.owner_id as producer_code", "ru.phone_no as producer_phone", "ru.address as producer_address",
      "af.email as producer_email", "t.trader_code", "t.trader_name", "t.mobile as trader_phone", "t.email as trader_email",
      "t.address as trader_address", "t.company_logo_url"
    )
    .first();
};

export const completeHarvest = (harvestId, payload, trx) =>
  getExecutor(trx)("aquaculture_harvests").where({ id: harvestId }).update(payload).returning("*");

export const findProcurementByHarvest = (harvestId, trx) =>
  getExecutor(trx)("procurements").where({ harvest_id: harvestId }).first();

export const insertProcurement = (payload, trx) => getExecutor(trx)("procurements").insert(payload).returning("*");
export const updateProcurement = (id, payload, trx) => getExecutor(trx)("procurements").where({ id }).update(payload).returning("*");

export const findProcurement = (id, trx, forUpdate = false) => {
  let query = getExecutor(trx)("procurements").where({ id }).first();
  if (forUpdate) query = query.forUpdate();
  return query;
};

export const listProcurements = (filters, trx) => {
  const query = getExecutor(trx)("procurements").orderBy("created_at", "desc");
  if (filters.trader_id) query.where({ trader_id: filters.trader_id });
  if (filters.producer_user_id) query.where({ producer_user_id: filters.producer_user_id });
  return query;
};

export const sumConfirmedPayments = async (procurementId, trx) => {
  const row = await getExecutor(trx)("procurement_payments")
    .where({ procurement_id: procurementId, status: "CONFIRMED" })
    .sum("amount as total")
    .first();
  return Number(row?.total || 0);
};

export const listConfirmedPayments = (procurementId, trx) =>
  getExecutor(trx)("procurement_payments")
    .where({ procurement_id: procurementId, status: "CONFIRMED" })
    .orderBy("paid_at", "asc")
    .orderBy("id", "asc");

export const findPaymentByIdempotencyKey = (key, trx) =>
  key ? getExecutor(trx)("procurement_payments").where({ idempotency_key: key }).first() : null;

export const insertPayment = (payload, trx) => getExecutor(trx)("procurement_payments").insert(payload).returning("*");
export const updatePayment = (id, payload, trx) => getExecutor(trx)("procurement_payments").where({ id }).update(payload).returning("*");
export const insertReceipt = (payload, trx) => getExecutor(trx)("payment_receipts").insert(payload).returning("*");
export const updateReceipt = (id, payload, trx) => getExecutor(trx)("payment_receipts").where({ id }).update(payload).returning("*");

export const findReceipt = (id, trx) =>
  getExecutor(trx)("payment_receipts as r")
    .join("procurements as p", "r.procurement_id", "p.id")
    .select("r.*", "p.trader_id", "p.producer_user_id")
    .where("r.id", id)
    .first();

export const findReceiptByToken = (token, trx) =>
  getExecutor(trx)("payment_receipts").where({ verification_token: token }).first();

export const listReceipts = (filters, trx) => {
  const query = getExecutor(trx)("payment_receipts as r")
    .join("procurements as p", "r.procurement_id", "p.id")
    .select("r.*", "p.trader_id", "p.producer_user_id")
    .orderBy("r.generated_at", "desc");
  if (filters.trader_id) query.where("p.trader_id", filters.trader_id);
  if (filters.producer_user_id) query.where("p.producer_user_id", filters.producer_user_id);
  return query;
};

export const findProducerUserByOwnerCode = (ownerCode, trx) =>
  getExecutor(trx)("rootverse_users").select("id").where({ owner_id: ownerCode }).first();
