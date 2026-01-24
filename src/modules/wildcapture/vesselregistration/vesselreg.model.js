import db from "../../../config/db.js";

const VESSEL_TABLE = "vessel_registration";

// ---- RV ID config ----
const ID_PREFIX = "RV-VES";
const DEFAULT_REGION = "TN";
const PAD_LEN = 6;

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

function buildRvVesselId({ region = DEFAULT_REGION, id }) {
  return `${ID_PREFIX}-${region}-${padN(id, PAD_LEN)}`;
}

/** ---------------------- Normalizers ---------------------- **/
function normalizeForInsert(payload = {}) {
  return {
    owner_id: payload.owner_id, 
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

  //  do not allow owner_id update from model layer too
  if ("owner_id" in updates) delete out.owner_id;

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
  const region = (opts.region || DEFAULT_REGION).toUpperCase().trim();

  return db.transaction(async (trx) => {
    const data = normalizeForInsert(payload);

    const [inserted] = await trx(VESSEL_TABLE).insert(
      {
        ...data,
        rv_vessel_id: null,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      },
      ["id"]
    );

    const id = inserted.id;
    const rv_vessel_id = buildRvVesselId({ region, id });

    const [created] = await trx(VESSEL_TABLE)
      .where({ id })
      .update(
        {
          rv_vessel_id,
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

//  get vessels by owner_id (numeric DB owner id)
export async function listVesselsByOwnerId(owner_id, { limit = 50, offset = 0, q = "" } = {}) {
  const query = db(VESSEL_TABLE).select("*").where({ owner_id });

  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    query.andWhere((b) => {
      b.whereILike("rv_vessel_id", like)
        .orWhereILike("govt_registration_number", like)
        .orWhereILike("vessel_name", like)
        .orWhereILike("home_port", like);
    });
  }

  const rows = await query.orderBy("id", "desc").limit(limit).offset(offset);
  return rows.map(mapRow);
}
