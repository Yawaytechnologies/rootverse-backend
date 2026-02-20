import * as service from "./service.js";

export const createQrBatch = async (req, res) => {
  try {
    const { count, type, districtId } = req.body;
    const qrs = await service.createQrBatch(count, type, districtId);
    res.status(201).json({ qrs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getQrByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const qr = await service.getQrByCode(code);
    if (!qr) {
      return res.status(404).json({ error: "QR code not found" });
    }
    res.json({ qr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQr = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedQr = await service.updateQr(id, updates);
        if (!updatedQr) {
            return res.status(404).json({ error: "QR code not found" });
        }
        res.json({ qr: updatedQr });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const listQrs = async (req, res) => {
    try {
        const filters = req.query;
        const qrs = await service.listQrs(filters);
        res.json({ qrs });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};