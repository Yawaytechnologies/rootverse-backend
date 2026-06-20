import db from "../../shared/lib/db.js";

const TRADER_FIELDS = [
  "id",
  "trader_code",
  "profile_image_url",
  "company_logo_url",
  "trader_name",
  "trader_type",
  "mobile",
  "email",
  "address",
  "operational_districts",
  "years_of_experience",
  "markets",
  "is_active",
  "created_at",
  "updated_at",
];

const serializeTraderPayload = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, "operational_districts")) return payload;
  return {
    ...payload,
    operational_districts: JSON.stringify(payload.operational_districts),
  };
};

export const createTrader = (payload) =>
  db("traders").insert(serializeTraderPayload(payload)).returning(TRADER_FIELDS);

export const findTraderByMobile = (mobile) =>
  db("traders").select(TRADER_FIELDS).where({ mobile }).first();

export const findTraderById = (id) =>
  db("traders").select(TRADER_FIELDS).where({ id }).first();

export const updateTraderImages = async (id, payload) => {
  const rows = await db("traders")
    .where({ id })
    .update({ ...payload, updated_at: db.fn.now() })
    .returning(TRADER_FIELDS);

  return rows[0] || null;
};

export const updateTraderStatus = async (id, isActive) => {
  const rows = await db("traders")
    .where({ id })
    .update({ is_active: isActive, updated_at: db.fn.now() })
    .returning(TRADER_FIELDS);

  return rows[0] || null;
};

export const listTraders = async ({ page = 1, page_size = 20 } = {}) => {
  const traders = await db("traders")
    .select(TRADER_FIELDS)
    .orderBy("created_at", "desc")
    .limit(Number(page_size))
    .offset((Number(page) - 1) * Number(page_size));

  return Promise.all(
    traders.map(async (trader) => {
      const [qualityCheckers, cratePackers, transportOperators] = await Promise.all([
        listQualityCheckersByTrader(trader.id),
        listCratePackersByTrader(trader.id),
        listTransportOperatorsByTrader(trader.id),
      ]);

      return {
        ...trader,
        quality_checkers: qualityCheckers,
        crate_packers: cratePackers,
        transport_operators: transportOperators,
      };
    })
  );
};

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
      "trader_id",
      "created_at",
      "updated_at"
    )
    .where({ trader_id: traderId })
    .orderBy("created_at", "desc");

export const getTraderDetail = async (traderId) => {
  const trader = await findTraderById(traderId);
  if (!trader) return null;

  const [qualityCheckers, cratePackers, transportOperators] = await Promise.all([
    listQualityCheckersByTrader(traderId),
    listCratePackersByTrader(traderId),
    listTransportOperatorsByTrader(traderId),
  ]);

  return {
    ...trader,
    quality_checkers: qualityCheckers,
    crate_packers: cratePackers,
    transport_operators: transportOperators,
  };
};

export const listCratesByTrader = async (traderId, { status, page = 1, page_size = 20 } = {}) => {
  const wildQuery = db("crate_qrs")
    .where({ trader_id: traderId })
    .select("*", db.raw("'CRATE_QR_MASTER' as source"));
  if (status) wildQuery.andWhere({ custody_status: status });

  const aquacultureQuery = db("aquaculture_crate_packings as acp")
    .innerJoin("crate_qrs as cq", "acp.crate_qr_id", "cq.id")
    .leftJoin("ponds as p", "acp.pond_id", "p.id")
    .leftJoin("aquaculture_harvests as ah", "acp.harvest_id", "ah.id")
    .where("acp.trader_id", traderId)
    .select(
      "acp.*",
      "cq.code as crate_qr_code",
      "cq.type as crate_qr_type",
      "p.pond_id as pond_code",
      "p.pond_name",
      "ah.species as harvest_species",
      db.raw("'AQUACULTURE_CRATE_PACKING' as source")
    );
  if (status) aquacultureQuery.andWhere("acp.packing_status", status);

  const [wildCrates, aquacultureCrates] = await Promise.all([wildQuery, aquacultureQuery]);
  return [...wildCrates, ...aquacultureCrates]
    .sort((a, b) => new Date(b.packed_at || b.updated_at || b.created_at) - new Date(a.packed_at || a.updated_at || a.created_at))
    .slice((Number(page) - 1) * Number(page_size), Number(page) * Number(page_size));
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
  const [qualityCheckers, cratePackers, transportOperators, crates, aquacultureCrates, progressEvents] = await Promise.all([
    db("quality_checker").where({ trader_id: traderId }).count("id as count").first(),
    db("crate_packer").where({ trader_id: traderId }).count("id as count").first(),
    db("transport_operators").where({ trader_id: traderId }).count("id as count").first(),
    db("crate_qrs").where({ trader_id: traderId }).select("custody_status"),
    db("aquaculture_crate_packings").where({ trader_id: traderId }).select("packing_status"),
    db("trader_progress_events").where({ trader_id: traderId }).count("id as count").first(),
  ]);

  return {
    quality_checkers: Number(qualityCheckers?.count || 0),
    crate_packers: Number(cratePackers?.count || 0),
    transport_operators: Number(transportOperators?.count || 0),
    progress_events: Number(progressEvents?.count || 0),
    crates: {
      total: crates.length + aquacultureCrates.length,
      crate_packing_pending: crates.filter((c) => c.custody_status === "CRATE_PACKING_PENDING").length,
      crate_packed:
        crates.filter((c) => c.custody_status === "CRATE_PACKED").length +
        aquacultureCrates.filter((c) => c.packing_status === "CRATE_PACKED").length,
      received_at_collection_centre: crates.filter((c) => c.custody_status === "RECEIVED_AT_COLLECTION_CENTRE").length,
      scheduled_for_dispatch: crates.filter((c) => c.custody_status === "SCHEDULED_FOR_DISPATCH").length,
      in_transit: crates.filter((c) => c.custody_status === "IN_TRANSIT").length,
      delivered: crates.filter((c) => c.custody_status === "DELIVERED").length,
      hold: crates.filter((c) => c.custody_status === "HOLD").length,
    },
  };
};
