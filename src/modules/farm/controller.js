import * as farmService from "./service.js";

export const registerFarm = async (req, res) => {
  try {
    const farm = await farmService.registerFarm(req.body,req.file);
    res.status(201).json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getFarmById = async (req, res) => {
  try {
    const farm = await farmService.getFarmById(req.params.id);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" });
    }   res.json(farm);
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllFarms = async (req, res) => {
  try {
    const farms = await farmService.getAllFarms(req.query);
    res.json(farms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFarmsByCode = async (req, res) => {
  try {
    const farm = await farmService.getFarmsByCode(req.params.code);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" });
    }
    res.json(farm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFarm = async (req, res) => {
  try {
    const farm = await farmService.updateFarm(req.params.id, req.body);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found" });
    }
    res.json(farm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const success = await farmService.deleteFarm(req.params.id);
    if (!success) {
        return res.status(404).json({ error: "Farm not found" });
    }
    res.json({ message: "Farm deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

