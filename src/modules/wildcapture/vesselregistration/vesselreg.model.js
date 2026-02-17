import db from "../../../config/db.js";

const VESSEL_TABLE = "vessel_registration";

// ---- RV ID config ----
const ID_PREFIX = "RV-VES";
const DEFAULT_REGION = "TN";
const PAD_LEN = 6;

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

    
    fishing_license_no: payload.fishing_license_no?.trim() ?? null,
    crew_capacity_max:
      payload.crew_capacity_max == null ? null : Number(payload.crew_capacity_max),
    storage_capacity_kg:
      payload.storage_capacity_kg == null ? null : Number(payload.storage_capacity_kg),
    engine_power_hp:
      payload.engine_power_hp == null ? null : Number(payload.engine_power_hp),
    fuel_type: payload.fuel_type?.trim() ?? null,

    // Enum values
    approval_status: payload.approval_status
      ? String(payload.approval_status).toUpperCase().trim()
      : undefined,
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

  // ✅ NEW
  if ("fishing_license_no" in updates)
    out.fishing_license_no = updates.fishing_license_no?.trim() ?? null;

  if ("crew_capacity_max" in updates)
    out.crew_capacity_max =
      updates.crew_capacity_max == null ? null : Number(updates.crew_capacity_max);

  if ("storage_capacity_kg" in updates)
    out.storage_capacity_kg =
      updates.storage_capacity_kg == null ? null : Number(updates.storage_capacity_kg);

  if ("engine_power_hp" in updates)
    out.engine_power_hp =
      updates.engine_power_hp == null ? null : Number(updates.engine_power_hp);

  if ("fuel_type" in updates)
    out.fuel_type = updates.fuel_type?.trim() ?? null;

  // ✅ enum: PENDING / APPROVED
  if ("approval_status" in updates) {
    out.approval_status =
      updates.approval_status == null
        ? null
        : String(updates.approval_status).toUpperCase().trim();
  }

  //  Do not allow owner_id update from model layer
  if ("owner_id" in updates) delete out.owner_id;

  out.updated_at = db.fn.now();
  return out;
}

function mapRow(row) {
  return row;
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
        .orWhereILike("home_port", like)
        .orWhereILike("fishing_license_no", like)
        .orWhereILike("fuel_type", like);
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

// Get vessels by owner_id (numeric DB owner id)
export async function listVesselsByOwnerId(
  owner_id,
  { limit = 50, offset = 0, q = "" } = {}
) {
  const query = db(VESSEL_TABLE).select("*").where({ owner_id });

  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    query.andWhere((b) => {
      b.whereILike("rv_vessel_id", like)
        .orWhereILike("govt_registration_number", like)
        .orWhereILike("vessel_name", like)
        .orWhereILike("home_port", like)
        .orWhereILike("fishing_license_no", like)
        .orWhereILike("fuel_type", like);
    });
  }

  const rows = await query.orderBy("id", "desc").limit(limit).offset(offset);
  return rows.map(mapRow);
}
