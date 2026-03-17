import { generateKey } from "../../shared/utils/storageKey.js";
import { uploadFile } from "../../shared/services/storage.service.js";
import * as farmRepository from "./repository.js";
export const registerFarm = async (data, file) => {
  try {
    const {
      name,
      location_id,
      owner_id,
      total_area,
      water_source,
      farm_address,
      country_id,
      state_id,
      pond_count,
      latitude,
      longitude,
      district_id,
    } = data;
    if (
      !name ||
      !location_id ||
      !owner_id ||
      !total_area ||
      !water_source ||
      !farm_address ||
      !country_id ||
      !state_id ||
      !district_id ||
      !pond_count ||
      !latitude ||
      !longitude
    ) {
      throw new Error("All fields are required");
    }
    if (!file) {
      throw new Error("Farm image is required");
    }

    const key = generateKey("farms", file.originalname);
    const imageUrl = await uploadFile(file, key);

    const farm = await farmRepository.createFarm({
      name,
      location_id,
      owner_id,
      total_area,
      water_source,
      farm_address,
      country_id,
      state_id,
      pond_count,
      district_id,
      latitude,
      longitude,
      image_url: imageUrl,
      image_key: key,
    });
    return farm;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getFarmById = async (id) => {
  return await farmRepository.getFarmById(id);
};

export const getAllFarms = async (filters) => {
  return await farmRepository.getAllFarms(filters);
};

export const getFarmsByCode = async (code) => {
  return await farmRepository.getFarmsByCode(code);
};

export const updateFarm = async (id, data) => {
  const farm = await farmRepository.getFarmById(id);
  if (!farm) {
    throw new Error("Farm not found");
  }
  return await farmRepository.updateFarm(id, data);
};

export const deleteFarm = async (id) => {
  const farm = await farmRepository.getFarmById(id);
  if (!farm) {
    throw new Error("Farm not found");
  }
  return await farmRepository.deleteFarm(id);
};

