// src/modules/wildcapture/vesselreg/vesselreg.model.js
import db from "../../../config/db.js";

const VESSEL_TABLE = "wild_vessels";

/* ----------------------------- JSON helpers ----------------------------- */

function toJsonString(v) {
  if (v == null) return "[]";
  if (Array.isArray(v)) return JSON.stringify(v);

  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return JSON.stringify(Array.isArray(parsed) ? parsed : [parsed]);
    } catch {
      return JSON.stringify([v]);
    }
  }

  return JSON.stringify([String(v)]);
}

function fromJsonString(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function pad6(n) {
  const s = String(n);
  return s.length >= 6 ? s : "0".repeat(6 - s.length) + s;
}

/* ----------------------------- DB helpers ----------------------------- */
// Postgres supports returning(), SQLite may not.
async function insertWithFallback(trx, table, payload, refetchWhere) {
  try {
    const [row] = await trx(table).insert(payload).returning("*");
    return row || null;
  } catch {
    await trx(table).insert(payload);
    return trx(table).where(refetchWhere).first();
  }
}

async function updateWithFallback(trx, table, where, patch) {
  try {
    const [row] = await trx(table).where(where).update(patch).returning("*");
    return row || null;
  } catch {
    await trx(table).where(where).update(patch);
    return trx(table).where(where).first();
  }
}

/* -------------------------- ID generation -------------------------- */
/**
 * Generates: RV-VES-{STATE}-000001
 * Uses id_sequences: (key, next_value, updated_at)
 */
async function nextVesselId(trx, stateCode = "TN") {
  const key = `RV-VES-${String(stateCode).toUpperCase()}`;

  const existing = await trx(SEQ_TABLE).where({ key }).first();

  if (!existing) {
    // First number for this key should be 1
    await trx(SEQ_TABLE).insert({
      key,
      next_value: 1,
      updated_at: trx.fn.now(),
    });
  } else {
    await trx(SEQ_TABLE).where({ key }).increment("next_value", 1);
    await trx(SEQ_TABLE).where({ key }).update({ updated_at: trx.fn.now() });
  }

  const row = await trx(SEQ_TABLE).where({ key }).first();
  const num = row?.next_value ?? 1;

  return `${key}-${pad6(num)}`;
}

/* ----------------------------- Hydrator ----------------------------- */

function hydrate(row) {
  if (!row) return row;
  return {
    ...row,
    allowed_fishing_methods: fromJsonString(row.allowed_fishing_methods),
  };
}

/* ----------------------------- CRUD ----------------------------- */

export async function createVessel(payload) {
  return db.transaction(async (trx) => {
    const stateCode = payload?.state_code || "TN";
    const rv_vessel_id = await nextVesselId(trx, stateCode);

    const insert = {
      rv_vessel_id,
      govt_registration_number: String(
        payload?.govt_registration_number || ""
      ).trim(),
      local_identifier: payload?.local_identifier
        ? String(payload.local_identifier).trim()
        : null,
      vessel_name: String(payload?.vessel_name || "").trim(),
      home_port: String(payload?.home_port || "").trim(),
      vessel_type: String(payload?.vessel_type || "").trim(),
      allowed_fishing_methods: toJsonString(payload?.allowed_fishing_methods),
      // If your wild_vessels table has created_at/updated_at defaults, these are optional
      created_at: trx.fn.now(),
      updated_at: trx.fn.now(),
    };

    const row = await insertWithFallback(trx, VESSEL_TABLE, insert, {
      rv_vessel_id,
    });

    return hydrate(row);
  });
}

export async function listVessels({ limit = 20, offset = 0, q = "" } = {}) {
  const qb = db(VESSEL_TABLE).select("*").orderBy("id", "desc");

  if (q && String(q).trim()) {
    const term = `%${String(q).trim()}%`;
    qb.where((w) => {
      w.where("rv_vessel_id", "ilike", term)
        .orWhere("govt_registration_number", "ilike", term)
        .orWhere("vessel_name", "ilike", term)
        .orWhere("home_port", "ilike", term);
    });
  }

  const rows = await qb.limit(limit).offset(offset);
  return rows.map(hydrate);
}

export async function getVesselById(vesselId) {
  const row = await db(VESSEL_TABLE)
    .where({ rv_vessel_id: vesselId })
    .first();
  return row ? hydrate(row) : null;
}

export async function patchVessel(vesselId, patch = {}) {
  return db.transaction(async (trx) => {
    const exists = await trx(VESSEL_TABLE)
      .where({ rv_vessel_id: vesselId })
      .first();
    if (!exists) return null;

    const upd = {
      updated_at: trx.fn.now(),
    };

    if (patch.govt_registration_number !== undefined) {
      upd.govt_registration_number = patch.govt_registration_number
        ? String(patch.govt_registration_number).trim()
        : "";
    }

    if (patch.local_identifier !== undefined) {
      upd.local_identifier = patch.local_identifier
        ? String(patch.local_identifier).trim()
        : null;
    }

    if (patch.vessel_name !== undefined) {
      upd.vessel_name = patch.vessel_name
        ? String(patch.vessel_name).trim()
        : "";
    }

    if (patch.home_port !== undefined) {
      upd.home_port = patch.home_port ? String(patch.home_port).trim() : "";
    }

    if (patch.vessel_type !== undefined) {
      upd.vessel_type = patch.vessel_type ? String(patch.vessel_type).trim() : "";
    }

    if (patch.allowed_fishing_methods !== undefined) {
      upd.allowed_fishing_methods = toJsonString(patch.allowed_fishing_methods);
    }

    const row = await updateWithFallback(
      trx,
      VESSEL_TABLE,
      { rv_vessel_id: vesselId },
      upd
    );

    return hydrate(row);
  });
}

export async function deleteVessel(vesselId) {
  // optional helper
  const deleted = await db(VESSEL_TABLE).where({ rv_vessel_id: vesselId }).del();
  return deleted > 0;
}
