import {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
  getDistrictsByStateId,
} from "./district.model.js";

export async function registerDistrict(payload) {
  const district = await createDistrict(payload); // ✅ no []
  return district;
}

export async function listDistricts() {
  return await getAllDistricts();
}

// (This is duplicate — keep one, but I’m not changing your API names)
export async function listAllDistricts() {
  return await getAllDistricts();
}

export async function getDistrict(id) {
  return await getDistrictById(id);
}

export async function modifyDistrict(id, updates) {
  const district = await updateDistrict(id, updates); // ✅ no []
  return district;
}

export async function removeDistrict(id) {
  await deleteDistrict(id);
  return;
}

export async function listDistrictsByState(state_id) {
  return await getDistrictsByStateId(state_id);
}
