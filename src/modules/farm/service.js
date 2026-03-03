export const registerFarm = async (data) => {
  try {
    const {
      name,
      location_id,
      owner_id,
      total_area,
      water_source,
      farm_address,
    } = data;
    if (
      !name ||
      !location_id ||
      !owner_id ||
      !total_area ||
      !water_source ||
      !farm_address
    ) {
      throw new Error("All fields are required");
    }
    const location = await findlocationById(location_id);
    if (!location) {
      throw new Error("Location not found");
    }
    const owner = await findOwnerById(owner_id);
    if (!owner) {
      throw new Error("Owner not found");
    }
    const farm = await createFarm({
      name,
      location_id,
      owner_id,
      total_area,
      water_source,
      farm_address,
    });
    return farm;
  } catch (error) {
    throw new Error(error.message);
  }
};
