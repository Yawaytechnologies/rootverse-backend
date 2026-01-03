import db from "../../../config/db.js";

const VESSEL_TABLE = "vessel_registration";
const SEQ_TABLE = "id_sequences";

// ---- RV ID config ----
const ID_PREFIX = "RV-VES";
const DEFAULT_REGION = "TN";
const PAD_LEN = 4; // RV-VES-TN-0001 fits in varchar(15)

/** ---------------------- JSON helpers ---------------------- **/
function toJsonString(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return JSON.stringify(v);

  if (typeof v === "string") {
    try {
      return JSON.stringify(JSON.parse(v));
    } catch {
      return JSON.stringify([v]);
    }
  }

  return JSON.stringify([String(v)]);
}

function fromJsonString(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return null;

  try {
    return JSON.parse(v);
  } catch {
    return v;
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

  await trx(SEQ_TABLE).insert({
    key,
    next_value: 2,
    updated_at: trx.fn.now(),
  });

  return { key, next_value: 1 };
}

async function nextSequenceValue(trx, key) {
  const row = await ensureSequenceRow(trx, key);

  const current =
    typeof row.next_value === "string"
      ? BigInt(row.next_value)
      : BigInt(row.next_value ?? 1);

  const next = current + 1n;

  await trx(SEQ_TABLE).where({ key }).update({
    next_value: next.toString(),
    updated_at: trx.fn.now(),
  });

  return current;
}

function buildRvVesselId({ region = DEFAULT_REGION, seq }) {
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

export async function createVessel(payload, opts = {}) {
  const region = (opts.region || DEFAULT_REGION).toUpperCase();
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

export async function listVessels({ limit = 20, offset = 0, q = "" } = {}) {
  const query = db(VESSEL_TABLE).select("*");

  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    query.where((b) => {
      b.whereILike("rv_vessel_id", like)
        .orWhereILike("govt_registration_number", like)
        .orWhereILike("vessel_name", like)
        .orWhereILike("home_port", like);
    });
  }

  const rows = await query.orderBy("id", "desc").limit(limit).offset(offset);
  return rows.map(mapRow);
}

export async function getVesselById(id) {
  const row = await db(VESSEL_TABLE).where({ id }).first();
  return mapRow(row);
}

export async function getVesselByRvId(rv_vessel_id) {
  const row = await db(VESSEL_TABLE).where({ rv_vessel_id }).first();
  return mapRow(row);
}

export async function patchVessel(id, updates) {
  const patch = normalizeForUpdate(updates);
  const [row] = await db(VESSEL_TABLE).where({ id }).update(patch, "*");
  return mapRow(row);
}

export async function deleteVessel(id) {
  const deleted = await db(VESSEL_TABLE).where({ id }).del();
  return deleted > 0;
}
