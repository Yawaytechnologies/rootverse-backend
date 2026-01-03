import { registerOwner, verifyOwnerService, listAllOwners, getOwnerService, updateOwnerService, fetchUsersByRootverseType } from "./owner.service.js";

export async function createOwner(req, res) {
    try {
        let payload = req.body;
        if (typeof req.body.data === 'string') {
            payload = JSON.parse(req.body.data);
        }
        const profileImage = req.files ? req.files.find(file => file.fieldname === 'profile_image') : null;
        const owner = await registerOwner(payload, profileImage);
        res.status(201).json(owner);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function verifyOwnerController(req, res) {
    try {
        const { id } = req.params;
        const { verification_status } = req.body;
        const owner = await verifyOwnerService(id, verification_status);
        res.status(200).json(owner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function listOwners(req, res) {
    try {
        const owners = await listAllOwners();
        res.status(200).json(owners);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getOwnerController(req, res) {
    try {
        const { id } = req.params;
        const owner = await getOwnerService(id);
        if (!owner) return res.status(404).json({ error: "Owner not found" });
        res.status(200).json(owner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateOwnerController(req, res) {
    try {
        const { id } = req.params;
        let payload = req.body;
        if (typeof req.body.data === 'string') payload = JSON.parse(req.body.data);
        const owner = await updateOwnerService(id, payload);
        res.status(200).json(owner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export async function getUsersByRootverseTypeController(req, res) {
  try {
    const { rootverse_type } = req.params;

    const validTypes = ["WILD_CAPTURE", "AQUACULTURE", "MARICULTURE"];
    if (!validTypes.includes(rootverse_type)) {
      return res.status(400).json({ error: "Invalid rootverse_type" });
    }

    const data = await fetchUsersByRootverseType(rootverse_type);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}


