import { registerOwner, verifyOwnerService, listAllOwners, getOwnerService, updateOwnerService, fetchUsersByRootverseType, verifyOwnerDocs, formatOwner, deleteOwnerService, getOwnerByLocationService } from "./owner.service.js";

export async function createOwner(req, res) {
    try {
         console.log("req.files:", req.files);
         console.log("req.file:", req.file);

        let payload = req.body;
        if (typeof req.body.data === 'string') {
            payload = JSON.parse(req.body.data);
        }
        const profileImage = req.file; 
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


export async function updateVerification(req, res) {
  try {
    const ownerId = req.params.id;
    const payload = req.body;

    const owner = await verifyOwnerDocs(ownerId, payload);
    res.json(formatOwner(owner));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function deleteOwnerController(req, res) {
    try {
        const { id } = req.params;
        const result = await deleteOwnerService(id);
        res.status(200).json(result);
    }
    catch (err) {        console.error("Error deleting owner:", err);
        try {
            await deleteOwnerService(id);
        } catch (deleteErr) {
            console.error("Failed to delete owner on error:", deleteErr);
        }
        res.status(400).json({ error: err.message });
    }
}

export async function getOwnerByLocationController(req, res) {
    try {        const { location_id } = req.params;
        const owners = await getOwnerByLocationService(location_id);
        res.status(200).json(owners);
    }
    catch (err) {        console.error("Error fetching owners by location:", err);
        try {
            await getOwnerByLocationService(location_id);
        } catch (fetchErr) {
            console.error("Failed to fetch owners by location on error:", fetchErr);
        }        res.status(400).json({ error: err.message });
    }
}

