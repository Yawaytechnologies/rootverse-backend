import * as repository from "./repository.js";
import { generateKey } from "../../shared/utils/storageKey.js";
import { uploadFile } from "../../shared/services/storage.service.js";
export const createPond = async (data, file) => {
  const { name, area, farm_id, species_id } = data;
  if (!name || !area || !farm_id || !species_id) {
    throw new Error(
      "Missing required fields: name, area, farm_id, species_id",
    );
  }
  const key = generateKey("ponds", file.originalname);
  const uploadedImageUrl = await uploadFile(file, key);
  const pondData = {
    name,
    area,
    image_url: uploadedImageUrl,
    image_key: key,
    farm_id,
    species_id,
  };
  return await repository.createPond(pondData);
};

export const getPondById = async (id) => {
  return await repository.getPondById(id);
};

export const getAllPonds = async (filters) => {
  return await repository.getAllPonds(filters);
};
export const getPondsByCode = async (code) => {
  return await repository.getPondsByCode(code);
};
export const updatePond = async (id, data) => {
  return await repository.updatePond(id, data);
};

export const deletePond = async (id) => {
  return await repository.deletePond(id);
};


