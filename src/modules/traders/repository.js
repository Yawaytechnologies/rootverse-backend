import db from "../../shared/lib/db.js";

export const createTrader = (payload) =>
  db("traders").insert(payload).returning([
    "id",
    "trader_code",
    "organization_name",
    "contact_name",
    "email",
    "mobile",
    "address",
    "state",
    "district",
    "organization_type",
    "is_active",
    "created_at",
    "updated_at",
  ]);

export const findTraderByLoginId = (loginId) =>
  db("traders")
    .where((qb) => qb.where("trader_code", loginId).orWhere("email", loginId).orWhere("mobile", loginId))
    .first();

export const findTraderById = (id) =>
  db("traders")
    .select(
      "id",
      "trader_code",
      "organization_name",
      "contact_name",
      "email",
      "mobile",
      "address",
      "state",
      "district",
      "organization_type",
      "is_active",
      "created_at",
      "updated_at"
    )
    .where({ id })
    .first();

export const listTraders = ({ page = 1, page_size = 20 } = {}) =>
  db("traders")
    .select(
      "id",
      "trader_code",
      "organization_name",
      "contact_name",
      "email",
      "mobile",
      "state",
      "district",
      "is_active",
      "created_at"
    )
    .orderBy("created_at", "desc")
    .limit(Number(page_size))
    .offset((Number(page) - 1) * Number(page_size));

export const insertQualityChecker = (payload) =>
  db("quality_checker").insert(payload).returning("*");

export const listQualityCheckersByTrader = (traderId) =>
  db("quality_checker").where({ trader_id: traderId }).orderBy("created_at", "desc");

export const insertCratePacker = (payload) =>
  db("crate_packer").insert(payload).returning("*");

export const listCratePackersByTrader = (traderId) =>
  db("crate_packer").where({ trader_id: traderId }).orderBy("created_at", "desc");

export const insertTransportOperator = (payload) =>
  db("transport_operators")
    .insert(payload)
    .returning([
      "id",
      "operator_rv_id",
      "full_name",
      "email",
      "mobile",
      "transport_id",
      "vehicle_no",
      "route_name",
      "vehicle_type",
      "is_active",
      "trader_id",
      "created_at",
      "updated_at",
    ]);

export const listTransportOperatorsByTrader = (traderId) =>
  db("transport_operators")
    .select(
      "id",
      "operator_rv_id",
      "full_name",
      "email",
      "mobile",
      "transport_id",
      "vehicle_no",
      "route_name",
      "vehicle_type",
      "is_active",
      "created_at"
    )
    .where({ trader_id: traderId })
    .orderBy("created_at", "desc");

export const listCratesByTrader = (traderId, { status, page = 1, page_size = 20 } = {}) => {
  const q = db("crate_qrs").where({ trader_id: traderId });
  if (status) q.andWhere({ custody_status: status });
  return q.orderBy("updated_at", "desc").limit(Number(page_size)).offset((Number(page) - 1) * Number(page_size));
};

export const findTraderCrateById = (traderId, crateId) =>
  db("crate_qrs").where({ id: crateId, trader_id: traderId }).first();

export const updateCrateStatus = async (crateId, payload) => {
  const rows = await db("crate_qrs").where({ id: crateId }).update(payload).returning("*");
  return rows[0] || null;
};

export const insertProgressEvent = (payload) =>
  db("trader_progress_events").insert(payload).returning("*");

export const getDashboardCounts = async (traderId) => {
  const [qualityCheckers, cratePackers, transportOperators, crates, progressEvents] = await Promise.all([
    db("quality_checker").where({ trader_id: traderId }).count("id as count").first(),
    db("crate_packer").where({ trader_id: traderId }).count("id as count").first(),
    db("transport_operators").where({ trader_id: traderId }).count("id as count").first(),
    db("crate_qrs").where({ trader_id: traderId }).select("custody_status"),
    db("trader_progress_events").where({ trader_id: traderId }).count("id as count").first(),
  ]);

  return {
    quality_checkers: Number(qualityCheckers?.count || 0),
    crate_packers: Number(cratePackers?.count || 0),
    transport_operators: Number(transportOperators?.count || 0),
    progress_events: Number(progressEvents?.count || 0),
    crates: {
      total: crates.length,
      received_at_collection_centre: crates.filter((c) => c.custody_status === "RECEIVED_AT_COLLECTION_CENTRE").length,
      scheduled_for_dispatch: crates.filter((c) => c.custody_status === "SCHEDULED_FOR_DISPATCH").length,
      in_transit: crates.filter((c) => c.custody_status === "IN_TRANSIT").length,
      delivered: crates.filter((c) => c.custody_status === "DELIVERED").length,
      hold: crates.filter((c) => c.custody_status === "HOLD").length,
    },
  };
};
