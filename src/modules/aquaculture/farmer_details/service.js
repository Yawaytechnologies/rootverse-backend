import {
  createFarmerDetails,
  deleteFarmerDetailsById,
  deleteFarmerDetailsByUserId,
  getAllFarmerDetails,
  getFarmerDetailsById,
  getFarmerDetailsByUserId,
  getRootverseUserById,
  updateFarmerDetailsByUserId,
} from "./repository.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateId = (value, fieldName = "id") => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw createError(`Valid ${fieldName} is required`);
  }

  return id;
};

const normalizeDate = (value, fieldName) => {
  if (!value) {
    throw createError(`${fieldName} is required`);
  }

  const date = String(value).trim();

  if (Number.isNaN(new Date(date).getTime())) {
    throw createError(`Valid ${fieldName} is required`);
  }

  return date;
};

const getValue = (data, ...keys) => {
  for (const key of keys) {
    if (data[key] !== undefined) {
      return data[key];
    }
  }

  return undefined;
};

const normalizePayload = (data, requireAll = true) => {
  const payload = {};

  const userId = getValue(data, "user_id");
  const fatherName = getValue(data, "Father_name", "father_name");
  const dob = getValue(data, "DOB", "dob");
  const email = getValue(data, "email");
  const farmerLicence = getValue(data, "farmer_liscence", "farmer_license", "farmer_licence");
  const farmingExperience = getValue(data, "farming_experience");

  if (userId !== undefined || requireAll) {
    payload.user_id = validateId(userId, "user_id");
  }

  if (fatherName !== undefined || requireAll) {
    if (!fatherName || !String(fatherName).trim()) {
      throw createError("Father_name is required");
    }

    payload.Father_name = String(fatherName).trim();
  }

  if (dob !== undefined || requireAll) {
    payload.DOB = normalizeDate(dob, "DOB");
  }

  if (email !== undefined) {
    payload.email = email === null || email === "" ? null : String(email).trim();
  }

  if (farmerLicence !== undefined || requireAll) {
    if (!farmerLicence || !String(farmerLicence).trim()) {
      throw createError("farmer_liscence is required");
    }

    payload.farmer_liscence = String(farmerLicence).trim();
  }

  if (farmingExperience !== undefined || requireAll) {
    payload.farming_experience = normalizeDate(farmingExperience, "farming_experience");
  }

  return payload;
};

export const createFarmerDetailsService = async (data) => {
  const payload = normalizePayload(data);
  const user = await getRootverseUserById(payload.user_id);

  if (!user) {
    throw createError("Invalid user_id. User not found", 404);
  }

  const existingFarmer = await getFarmerDetailsByUserId(payload.user_id);

  if (existingFarmer) {
    throw createError("Farmer details already exist for this user_id", 409);
  }

  return createFarmerDetails(payload);
};

export const getAllFarmerDetailsService = async () => {
  return getAllFarmerDetails();
};

export const getFarmerDetailsByIdService = async (id) => {
  const farmerId = validateId(id);
  const farmer = await getFarmerDetailsById(farmerId);

  if (!farmer) {
    throw createError("Farmer details not found", 404);
  }

  return farmer;
};

export const getFarmerDetailsByUserIdService = async (user_id) => {
  const userId = validateId(user_id, "user_id");
  const farmer = await getFarmerDetailsByUserId(userId);

  if (!farmer) {
    throw createError("Farmer details not found for this user_id", 404);
  }

  return farmer;
};

export const updateFarmerDetailsByUserIdService = async (user_id, data) => {
  const userId = validateId(user_id, "user_id");
  const existingFarmer = await getFarmerDetailsByUserId(userId);

  if (!existingFarmer) {
    throw createError("Farmer details not found for this user_id", 404);
  }

  const payload = normalizePayload(data, false);
  delete payload.user_id;

  if (Object.keys(payload).length === 0) {
    throw createError("At least one field is required for update");
  }

  return updateFarmerDetailsByUserId(userId, payload);
};

export const deleteFarmerDetailsByIdService = async (id) => {
  const farmerId = validateId(id);
  const existingFarmer = await getFarmerDetailsById(farmerId);

  if (!existingFarmer) {
    throw createError("Farmer details not found", 404);
  }

  await deleteFarmerDetailsById(farmerId);

  return { message: "Farmer details deleted successfully" };
};

export const deleteFarmerDetailsByUserIdService = async (user_id) => {
  const userId = validateId(user_id, "user_id");
  const existingFarmer = await getFarmerDetailsByUserId(userId);

  if (!existingFarmer) {
    throw createError("Farmer details not found for this user_id", 404);
  }

  await deleteFarmerDetailsByUserId(userId);

  return { message: "Farmer details deleted successfully" };
};
