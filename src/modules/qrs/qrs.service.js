import { reserveQr, reserveBulkQrs, listQrs } from "./qrs.model.js";


const ALLOWED_TYPES = new Set(["CRATE", "TRIP", "VESSEL"]);


function normType(type) {
  return String(type || "").trim().toUpperCase();
}

export async function reserveQrservice(type="CRATE"){
    if(!type) throw new error("type is required");
    return reserveQr({type});

}


export async function reserveBulkService(type = "CRATE", count = 10) {
  const t = normType(type);
  if (!ALLOWED_TYPES.has(t)) throw new Error(`Invalid type: ${t}`);

  const c = Number(count);
  if (!Number.isFinite(c) || c < 1) throw new Error("count must be >= 1");
  if (c > 500) throw new Error("count too large (max 500)");

  return reserveBulkQrs({ type: t, count: c });
}

export async function listQrsService({ type, status, page, limit }) {
  const t = type ? normType(type) : undefined;
  const s = status ? String(status).trim().toUpperCase() : undefined;

  if (t && !ALLOWED_TYPES.has(t)) throw new Error(`Invalid type: ${t}`);
  if (s && !["NEW", "FILLED"].includes(s)) throw new Error(`Invalid status: ${s}`);

  return listQrs({ type: t, status: s, page, limit });
}