import db from "../../config/db.js";

const TABLE = "qrs";

function pad6n(n) {
    const s = String(n)
    return s.length >= 6 ? s : "0".repeat(6 - s.length) + s;
}

function normalizeType(type) {
  return String(type || "").trim().toUpperCase();
}

function buildCode(type, id){
    return `RV-${type}-${pad6n(id)}`;

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

  })
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
        .returning(["id", "type", "code", "status", "created_at", "updated_at"]);

      results.push(updated);
    }

    return results;
  });
}

/** Milestone 2: list QRs */
export async function listQrs({ type, status, page = 1, limit = 50 }) {
  const t = type ? normalizeType(type) : null;
  const s = status ? String(status).trim().toUpperCase() : null;

  const p = Math.max(1, Number(page || 1));
  const l = Math.max(1, Math.min(Number(limit || 50), 200));
  const offset = (p - 1) * l;

  const base = db(TABLE).modify((qb) => {
    if (t) qb.where({ type: t });
    if (s) qb.where({ status: s });
  });

  const items = await base
    .clone()
    .select("id", "type", "code", "status", "created_at", "updated_at")
    .orderBy("id", "desc")
    .limit(l)
    .offset(offset);

  const [{ count }] = await base.clone().count("* as count");

  return {
    page: p,
    limit: l,
    total: Number(count),
    items,
  };
}
