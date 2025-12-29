import {
  registerDistrict,
  listAllDistricts,
  listDistricts,
  modifyDistrict,
  removeDistrict,
  listDistrictsByState,
  getDistrict,
} from "./district.service.js";

export async function createDistrictController(req, res) {
  try {
    const payload = req.body;

    if (!payload?.name || !payload?.state_id) {
      return res.status(400).json({
        success: false,
        message: "name and state_id are required",
      });
    }

    const district = await registerDistrict(payload);

    return res.status(201).json({
      success: true,
      message: "District created successfully",
      data: district,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create district",
    });
  }
}

export async function listDistrictsController(req, res) {
  try {
    const districts = await listDistricts();

    return res.status(200).json({
      success: true,
      message: "Districts fetched successfully",
      data: districts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch districts",
    });
  }
}

export async function getallDistrictsController(req, res) {
  try {
    const districts = await listAllDistricts();

    return res.status(200).json({
      success: true,
      message: "All districts fetched successfully",
      data: districts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch districts",
    });
  }
}

export async function getDistrictController(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid district id",
      });
    }

    const district = await getDistrict(id);

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "District fetched successfully",
      data: district,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch district",
    });
  }
}

export async function updateDistrictController(req, res) {
  try {
    const id = Number(req.params.id);
    const updates = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid district id",
      });
    }

    const district = await modifyDistrict(id, updates);

    if (!district) {
      return res.status(404).json({
        success: false,
        message: "District not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "District updated successfully",
      data: district,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update district",
    });
  }
}

export async function deleteDistrictController(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid district id",
      });
    }

    await removeDistrict(id);

    // If you want message, you can't send 204.
    return res.status(200).json({
      success: true,
      message: "District deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete district",
    });
  }
}

export async function listDistrictsByStateController(req, res) {
  try {
    const state_id = Number(req.params.state_id);

    if (!Number.isInteger(state_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid state_id",
      });
    }

    const districts = await listDistrictsByState(state_id);

    return res.status(200).json({
      success: true,
      message: "Districts fetched successfully for the state",
      data: districts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message ||
        "Failed to fetch districts for the state",
    });
  }
}