export const createCratePacker = async (req, res) => {
  try {
    const cratePacker = await service.createCratePacker(req.body);
    res.status(201).json(cratePacker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCratePackerById = async (req, res) => {
  try {
    const { id } = req.params;
    const cratePacker = await service.getCratePackerById(id);
    if (!cratePacker) {
      return res.status(404).json({ error: "Crate packer not found" });
    }
    res.json(cratePacker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const updateCratePacker = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCratePacker = await service.updateCratePacker(id, req.body);
    if (!updatedCratePacker) {
      return res.status(404).json({ error: "Crate packer not found" });
    }
    res.json(updatedCratePacker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCratePacker = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await service.deleteCratePacker(id);
    if (!deleted) {
      return res.status(404).json({ error: "Crate packer not found" });
    }
    res.json({ message: "Crate packer deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listCratePackers = async (req, res) => {
  try {
    const cratePackers = await service.listCratePackers();
    res.json(cratePackers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
