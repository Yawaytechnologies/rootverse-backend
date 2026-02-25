import * as repo from "./repository.js";

export const createQrBatch = async (count, type, districtId) => {
  const allowedTypes = ["M", "A", "W"];
  if (!allowedTypes.includes(type)) {
    throw new Error("Invalid type. Allowed values are M, A, W.");
  }
  if (count <= 0 || !Number.isInteger(count)) {
    throw new Error("Count must be a positive integer.");
  }
  if (!districtId) {
    throw new Error("District ID is required.");
  }
  const qrs = await repo.createQrBatch(count, type, districtId);
  return qrs;
};

export const getQrByCode = async (code) => {
    return repo.getQrByCode(code);
};

export const updateQr = async (id, updates) => {
    const qr = await repo.getQrById(id);
    if (!qr) {
        throw new Error("QR code not found");
    }
    return repo.updateQr(id, updates);
};

export const listQrs = async (filters) => {
    return repo.listQrs(filters);
};