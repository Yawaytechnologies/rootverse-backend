import db from "../../config/db.js";

const TABLE = "qrs";
const FISH_TABLE = "fish-types";
const VESSEL_TABLE = "vessel_registration";
const USER_TABLE = "rootverse_users";
const TRIP_TABLE = "trip_plans";

function pad6n(n) {
  const s = String(n);
  return s.length >= 6 ? s : "0".repeat(6 - s.length) + s;
}

function normalizeType(type) {
  return String(type || "")
    .trim()
    .toUpperCase();
}

function buildCode(type, id) {
  return `RV-${type}-${pad6n(id)}`;
}

export async function getQrByIdPopulated(id) {
  const qr = await db(TABLE).where({ id }).first();
  if (!qr) return null;

  const [vessel, fish, owner, trip, qualityChecker] = await Promise.all([
    qr.rv_vessel_id
      ? db(VESSEL_TABLE).where({ id: qr.rv_vessel_id }).first()
      : null,
    qr.fish_id ? db(FISH_TABLE).where({ id: qr.fish_id }).first() : null,
    qr.owner_id ? db(USER_TABLE).where({ id: qr.owner_id }).first() : null,
    qr.trip_id ? db(TRIP_TABLE).where({ id: qr.trip_id }).first() : null,
    qr.quality_checker_id
      ? db("quality_checker").where({ id: qr.quality_checker_id }).first()
      : null,
  ]);

  // if trip not found but owner exists, try to infer trip by owner_code only
  let resolvedTrip = trip || null;
  if (!resolvedTrip && owner) {
    try {
      // Find the most recent trip for this owner
      const found = await db(TRIP_TABLE)
        .where("owner_code", owner.owner_id)
        .orderBy("planned_at", "desc")
        .first();
      if (found) resolvedTrip = found;
    } catch (e) {
      // ignore lookup errors
    }
  }

  return {
    ...qr,
    vessel_name: vessel ? vessel.vessel_name : null,
    fish_name: fish ? fish.fish_name || fish.name : null,
    owner_name: owner ? owner.username : null,
    quality_checker_code: qualityChecker ? qualityChecker.code : null,
    quality_checker_name: qualityChecker ? qualityChecker.checker_name : null,
    vessel: vessel || null,
    fish: fish || null,
    owner: owner || null,
    trip: resolvedTrip || null,
    trip_value: resolvedTrip
      ? `${resolvedTrip.count}/${resolvedTrip.qr_count}`
      : null,
  };
}

export async function reserveQr({ type }) {
  return db.transaction(async (trx) => {
    // 1) insert row first
    const [row] = await trx(TABLE)
      .insert({ type, status: "NEW" })
      .returning(["id", "type", "status"]);

    // 2) build final code using id
    const code = buildCode(type, row.id);

    // 3) update code back
    const [updated] = await trx(TABLE)
      .where({ id: row.id })
      .update({ code, updated_at: trx.fn.now() })
      .returning(["id", "type", "code", "status", "created_at", "updated_at"]);

    return updated;
  });
}

/** Milestone 2: bulk reserve */
export async function reserveBulkQrs({ type, count }) {
  const t = normalizeType(type);
  const c = Number(count);

  return db.transaction(async (trx) => {
    // 1) insert N rows
    const rows = Array.from({ length: c }, () => ({
      type: t,
      status: "NEW",
    }));

    const inserted = await trx(TABLE)
      .insert(rows)
      .returning(["id", "type", "status", "created_at"]);

    // 2) update each row with its code
    const results = [];
    for (const r of inserted) {
      const code = buildCode(r.type, r.id);

      const [updated] = await trx(TABLE)
        .where({ id: r.id })
        .update({ code, updated_at: trx.fn.now() })
        .returning([
          "id",
          "type",
          "code",
          "status",
          "created_at",
          "updated_at",
        ]);

      results.push(updated);
    }

    return results;
  });
}

/** Milestone 2: list QRs */
// helper: batch populate vessel/fish/owner objects into QR items
async function populateQrItems(items) {
  if (!items || items.length === 0) return items;

  const vesselIds = Array.from(
    new Set(items.map((i) => i.rv_vessel_id).filter((v) => v != null)),
  );
  const fishIds = Array.from(
    new Set(items.map((i) => i.fish_id).filter((v) => v != null)),
  );
  const ownerIds = Array.from(
    new Set(items.map((i) => i.owner_id).filter((v) => v != null)),
  );
  const tripIds = Array.from(
    new Set(items.map((i) => i.trip_id).filter((v) => v != null)),
  );
  const qualityCheckerIds = Array.from(
    new Set(items.map((i) => i.quality_checker_id).filter((v) => v != null)),
  );

  const [vessels, fishes, owners, trips, qualityCheckers] = await Promise.all([
    vesselIds.length ? db(VESSEL_TABLE).whereIn("id", vesselIds) : [],
    fishIds.length ? db(FISH_TABLE).whereIn("id", fishIds) : [],
    ownerIds.length ? db(USER_TABLE).whereIn("id", ownerIds) : [],
    tripIds.length ? db(TRIP_TABLE).whereIn("id", tripIds) : [],
    qualityCheckerIds.length
      ? db("quality_checker").whereIn("id", qualityCheckerIds)
      : [],
  ]);

  const vesselById = Object.fromEntries((vessels || []).map((v) => [v.id, v]));
  const fishById = Object.fromEntries((fishes || []).map((f) => [f.id, f]));
  const ownerById = Object.fromEntries((owners || []).map((o) => [o.id, o]));
  const tripById = Object.fromEntries((trips || []).map((t) => [t.id, t]));
  const qualityCheckerById = Object.fromEntries(
    (qualityCheckers || []).map((q) => [q.id, q]),
  );

  const results = [];
  for (const it of items) {
    const vessel = it.rv_vessel_id ? vesselById[it.rv_vessel_id] || null : null;
    const fish = it.fish_id ? fishById[it.fish_id] || null : null;
    const owner = it.owner_id ? ownerById[it.owner_id] || null : null;

    // prefer explicit trip_id if present
    let tripObj = it.trip_id ? tripById[it.trip_id] || null : null;

    // if no trip and owner present, try to find the most recent trip by owner_code
    if (!tripObj && owner) {
      try {
        const found = await db(TRIP_TABLE)
          .where("owner_code", owner.owner_id)
          .orderBy("planned_at", "desc")
          .first();
        if (found) tripObj = found;
      } catch (e) {
        // ignore lookup failures and continue
      }
    }

    results.push({
      ...it,
      vessel,
      fish,
      owner,
      vessel_name: (vessel && vessel.vessel_name) || it.vessel_name || null,
      fish_name:
        (fish && (fish.fish_name || fish.name)) || it.fish_name || null,
      owner_name: (owner && owner.username) || it.owner_name || null,
      quality_checker_code:
        (qualityChecker && qualityChecker.code) ||
        it.quality_checker_code ||
        null,
      quality_checker_name:
        (qualityChecker && qualityChecker.checker_name) ||
        it.quality_checker_name ||
        null,
      trip: tripObj || null,
      trip_value: tripObj ? `${tripObj.count}/${tripObj.qr_count}` : null,
    });
  }

  return results;
}

export async function listQrs({
  type,
  status,
  page = 1,
  limit = 50,
  populate = false,
}) {
  const t = type ? normalizeType(type) : null;
  const s = status ? String(status).trim().toUpperCase() : null;

  const p = Math.max(1, Number(page || 1));
  const l = Math.max(1, Math.min(Number(limit || 50), 200));
  const offset = (p - 1) * l;

  const base = db(TABLE).modify((qb) => {
    if (t) qb.where({ type: t });
    if (s) qb.where({ status: s });
  });

  // select additional id fields to allow population without extra queries per item
  const items = await base
    .clone()
    .select(
      "id",
      "type",
      "code",
      "status",
      "rv_vessel_id",
      "fish_id",
      "owner_id",
      "trip_id",
      "weight",
      "date",
      "time",
      "latitude",
      "longitude",
      "image_url",
      "image_key",
      "qc_status",
      "qc_result",
      "quality_grade",
      "qc_score",
      "temperature_c",
      "size",
      "damage",
      "water_temperature",
      "ph_level",
      "grade",
      "odor_score",
      "firmness_score",
      "is_damaged",
      "reject_reason",
      "fish_images",
      "pond_condition_image",
      "quality_checker_id",
      "checked_at",
      "filled_at",
      "created_at",
      "updated_at",
    )
    .orderBy("id", "desc")
    .limit(l)
    .offset(offset);

  const [{ count }] = await base.clone().count("* as count");

  const resultItems = populate ? await populateQrItems(items) : items;

  return {
    page: p,
    limit: l,
    total: Number(count),
    items: resultItems,
  };
}

export async function updateQrStatus(id, status) {
  const s = String(status).trim().toUpperCase();
  const [updated] = await db(TABLE)
    .where({ id })
    .update({ status: s, updated_at: db.fn.now() })
    .returning("*");
  return updated;
}

export async function getlistQrs({
  type,
  status,
  page = 1,
  limit = 50,
  populate = false,
}) {
  const t = type ? normalizeType(type) : null;
  const s = status ? String(status).trim().toUpperCase() : null;

  const p = Math.max(1, Number(page || 1));
  const l = Math.max(1, Math.min(Number(limit || 50), 200));
  const offset = (p - 1) * l;

  const base = db(`${TABLE} as q`)
    .leftJoin(`${VESSEL_TABLE} as v`, "q.rv_vessel_id", "v.id")
    .leftJoin(`${FISH_TABLE} as f`, "q.fish_id", "f.id")
    .leftJoin(`${USER_TABLE} as u`, "q.owner_id", "u.id")
    .modify((qb) => {
      if (t) qb.where("q.type", t);
      if (s) qb.where("q.status", s);
    });

  const items = await base
    .clone()
    .select(
      "q.id",
      "q.type",
      "q.code",
      "q.status",
      "q.rv_vessel_id",
      "v.vessel_name as vessel_name",
      "q.fish_id",
      "f.fish_name as fish_name",
      "q.owner_id",
      "u.username as owner_name",
      "q.weight",
      "q.date",
      "q.time",
      "q.latitude",
      "q.longitude",
      "q.image_url",
      "q.image_key",
      "q.qc_status",
      "q.qc_result",
      "q.quality_grade",
      "q.qc_score",
      "q.temperature_c",
      "q.sample_count",
      "q.odor_score",
      "q.gill_score",
      "q.eye_score",
      "q.firmness_score",
      "q.ice_present",
      "q.packaging_intact",
      "q.foreign_matter_found",
      "q.is_mixed_species",
      "q.is_contaminated",
      "q.is_damaged",
      "q.reject_reason",
      "q.qc_remarks",
      "q.crate_image_url",
      "q.crate_image_key",
      "q.checked_at",
      "q.filled_at",
      "q.created_at",
      "q.updated_at",
    )
    .orderBy("q.id", "desc")
    .limit(l)
    .offset(offset);

  const [{ count }] = await base.clone().count("* as count");

  const resultItems = populate ? await populateQrItems(items) : items;

  return {
    page: p,
    limit: l,
    total: Number(count),
    items: resultItems,
  };
}

/** ✅ Update full record (including vessel/fish/owner) */
export async function updateQr(id, updates) {
  await db(TABLE)
    .where({ id })
    .update({ ...updates, updated_at: db.fn.now() });
  return getQrByIdPopulated(id);
}

export async function getQrByCodePopulate(code) {
  return db.transaction(async (trx) => {
    const qr = await trx(TABLE).where({ code }).first();
    if (!qr) return null;

    const [vessel, fish, owner, trip, qualityChecker] = await Promise.all([
      qr.rv_vessel_id
        ? trx(VESSEL_TABLE).where({ id: qr.rv_vessel_id }).first()
        : null,
      qr.fish_id ? trx(FISH_TABLE).where({ id: qr.fish_id }).first() : null,
      qr.owner_id ? trx(USER_TABLE).where({ id: qr.owner_id }).first() : null,
      qr.trip_id ? trx(TRIP_TABLE).where({ id: qr.trip_id }).first() : null,
      qr.quality_checker_id
        ? trx("quality_checker").where({ id: qr.quality_checker_id }).first()
        : null,
    ]);

    // attempt to resolve trip when missing using owner_code only
    let resolvedTrip = trip || null;
    if (!resolvedTrip && owner) {
      try {
        // Find the most recent trip for this owner
        const found = await trx(TRIP_TABLE)
          .where("owner_code", owner.owner_id)
          .orderBy("planned_at", "desc")
          .first();
        if (found) resolvedTrip = found;
      } catch (e) {
        // ignore
      }
    }

    return {
      ...qr,
      vessel_name: vessel ? vessel.vessel_name : null,
      fish_name: fish ? fish.fish_name || fish.name : null,
      owner_name: owner ? owner.username : null,
      quality_checker_code: qualityChecker ? qualityChecker.code : null,
      quality_checker_name: qualityChecker ? qualityChecker.checker_name : null,
      vessel: vessel || null,
      fish: fish || null,
      owner: owner || null,
      trip: resolvedTrip || null,
      trip_value: resolvedTrip
        ? `${resolvedTrip.count}/${resolvedTrip.qr_count}`
        : null,
    };
  });
}

export function deleteQr(id) {
  return db(TABLE).where({ id }).del();
}

export async function getQrByStatusAndCode(status, code) {
  const qr = await db(TABLE).where({ status, code }).first();
  if (!qr) return null;

  const [vessel, fish, owner, trip] = await Promise.all([
    qr.rv_vessel_id
      ? db(VESSEL_TABLE).where({ id: qr.rv_vessel_id }).first()
      : null,
    qr.fish_id ? db(FISH_TABLE).where({ id: qr.fish_id }).first() : null,
    qr.owner_id ? db(USER_TABLE).where({ id: qr.owner_id }).first() : null,
    qr.trip_id ? db(TRIP_TABLE).where({ id: qr.trip_id }).first() : null,
  ]);

  // if trip not found but owner exists, try to infer trip by owner_code only
  let resolvedTrip = trip || null;
  if (!resolvedTrip && owner) {
    try {
      // Find the most recent trip for this owner
      const found = await db(TRIP_TABLE)
        .where("owner_code", owner.owner_id)
        .orderBy("planned_at", "desc")
        .first();
      if (found) resolvedTrip = found;
    } catch (e) {
      // ignore lookup errors
    }
  }

  return {
    ...qr,
    vessel_name: vessel ? vessel.vessel_name : null,
    fish_name: fish ? fish.fish_name || fish.name : null,
    owner_name: owner ? owner.username : null,
    vessel: vessel || null,
    fish: fish || null,
    owner: owner || null,
    trip: resolvedTrip || null,
    trip_value: resolvedTrip
      ? `${resolvedTrip.count}/${resolvedTrip.qr_count}`
      : null,
  };
}

export const getAllCatchlogsRepo = async (filters) => {
  const q = db(`${TABLE} as qr`)
    .leftJoin(`${VESSEL_TABLE} as v`, "v.id", "qr.rv_vessel_id")
    .leftJoin(`${FISH_TABLE} as f`, "f.id", "qr.fish_id")
    .leftJoin(`${USER_TABLE} as u`, "u.id", "qr.owner_id")
    .leftJoin(`${TRIP_TABLE} as t`, "t.id", "qr.trip_id")
    .select([
      "qr.*",
      db.raw("to_jsonb(v) as vessel"),
      db.raw("to_jsonb(f) as fish"),
      db.raw("to_jsonb(u) as owner"),
      db.raw("to_jsonb(t) as trip"),
    ]);
  if (filters.trip_status) {
    q.where("t.approval_status", filters.trip_status);
  }
  if (filters.trip_id) {
    q.where("qr.trip_id", filters.trip_id)
  }
  
  return q;
};
