// src/modules/wildcapture/vesselreg/vesselreg.model.js
import db from "../../../config/db.js";

const VESSEL_TABLE = "vessel_registration";
const SEQ_TABLE = "id_sequences"; // make sure you have this migration too

// ---- RV ID config (matches your rv_vessel_id length 15) ----
const ID_PREFIX = "RV-VES";
const DEFAULT_REGION = "TN";
const PAD_LEN = 4; // RV-VES-TN-0001 => 14 chars (fits in varchar(15))

/** ---------------------- JSON helpers ---------------------- **/
function toJsonString(v) {
  if (v == null) return null; // your migration allows nullable
  if (Array.isArray(v)) return JSON.stringify(v);

  if (typeof v === "string") {
    // if user sends already-json string, keep it
    try {
      const parsed = JSON.parse(v);
      return JSON.stringify(parsed);
    } catch {
      // if it's plain string, wrap as array (optional)
      return JSON.stringify([v]);
    }
  }

  // fallback
  return JSON.stringify([String(v)]);
}

function fromJsonString(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return null;

  try {
    const parsed = JSON.parse(v);
    return parsed;
  } catch {
    return v; // return raw string if not JSON
  }
}

function padN(n, len) {
  const s = String(n);
  return s.length >= len ? s : "0".repeat(len - s.length) + s;
}

/** ---------------------- Sequence helpers ---------------------- **/
async function ensureSequenceRow(trx, key) {
  const row = await trx(SEQ_TABLE).where({ key }).forUpdate().first();
  if (row) return row;

  // row doesn't exist -> create with next_value = 2, return "1" for current
  await trx(SEQ_TABLE).insert({
    key,
    next_value: 2,
    updated_at: trx.fn.now(),
  });

  return { key, next_value: 1 };
}

async function nextSequenceValue(trx, key) {
  try {
    const row = await ensureSequenceRow(trx, key);

    // pg may return bigint as string
    const current = typeof row.next_value === "string"
      ? BigInt(row.next_value)
      : BigInt(row.next_value ?? 1);

    const next = current + 1n;

    await trx(SEQ_TABLE).where({ key }).update({
      next_value: next.toString(),
      updated_at: trx.fn.now(),
    });

    return current;
  } catch (err) {
    // common issue: id_sequences table missing
    if (String(err?.message || "").includes(`relation "${SEQ_TABLE}" does not exist`)) {
      throw new Error(
        `Missing table "${SEQ_TABLE}". Run the id_sequences migration first (knex migrate:latest).`
      );
    }
    throw err;
  }
}

function buildRvVesselId({ region = DEFAULT_REGION, seq }) {
  // Example: RV-VES-TN-0001
  return `${ID_PREFIX}-${region}-${padN(seq, PAD_LEN)}`;
}

/** ---------------------- Normalizers ---------------------- **/
function normalizeForInsert(payload = {}) {
  return {
    rv_vessel_id: payload.rv_vessel_id?.trim() || null,
    govt_registration_number: payload.govt_registration_number?.trim(),
    local_identifier: payload.local_identifier?.trim() ?? null,
    vessel_name: payload.vessel_name?.trim(),
    home_port: payload.home_port?.trim(),
    vessel_type: payload.vessel_type?.trim(),
    allowed_fishing_methods:
      payload.allowed_fishing_methods == null
        ? null
        : toJsonString(payload.allowed_fishing_methods),
  };
}

function normalizeForUpdate(updates = {}) {
  const out = {};

  if ("govt_registration_number" in updates)
    out.govt_registration_number = updates.govt_registration_number?.trim();

  if ("local_identifier" in updates)
    out.local_identifier = updates.local_identifier?.trim() ?? null;

  if ("vessel_name" in updates) out.vessel_name = updates.vessel_name?.trim();
  if ("home_port" in updates) out.home_port = updates.home_port?.trim();
  if ("vessel_type" in updates) out.vessel_type = updates.vessel_type?.trim();

  if ("allowed_fishing_methods" in updates) {
    out.allowed_fishing_methods =
      updates.allowed_fishing_methods == null
        ? null
        : toJsonString(updates.allowed_fishing_methods);
  }

  out.updated_at = db.fn.now();
  return out;
}

function mapRow(row) {
  if (!row) return row;
  return {
    ...row,
    allowed_fishing_methods: fromJsonString(row.allowed_fishing_methods),
  };
}

/** ---------------------- CRUD ---------------------- **/

// Create vessel (auto-generates rv_vessel_id if not provided)
export async function createVessel(payload, opts = {}) {
  const region = opts.region || DEFAULT_REGION;
  const seqKey = `${ID_PREFIX}-${region}`;

  return db.transaction(async (trx) => {
    const data = normalizeForInsert(payload);

    if (!data.rv_vessel_id) {
      const seq = await nextSequenceValue(trx, seqKey);
      data.rv_vessel_id = buildRvVesselId({ region, seq: seq.toString() });
    }

    const [created] = await trx(VESSEL_TABLE).insert(
      {
        ...data,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      },
      "*"
    );

    return mapRow(created);
  });
}

// List all
export async function getAllVessels() {
  const rows = await db(VESSEL_TABLE)
    .select("*")
    .orderBy("id", "desc");
  return rows.map(mapRow);
}

// Get by numeric id
export async function getVesselById(id) {
  const row = await db(VESSEL_TABLE).where({ id }).first();
  return mapRow(row);
}

// Get by RV vessel id
export async function getVesselByRvId(rv_vessel_id) {
  const row = await db(VESSEL_TABLE).where({ rv_vessel_id }).first();
  return mapRow(row);
}

// Update (PATCH style)
export async function updateVessel(id, updates) {
  const patch = normalizeForUpdate(updates);

  const [row] = await db(VESSEL_TABLE)
    .where({ id })
    .update(patch, "*");

  return mapRow(row);
}

// Delete
export async function deleteVessel(id) {
  return db(VESSEL_TABLE).where({ id }).del();
}
