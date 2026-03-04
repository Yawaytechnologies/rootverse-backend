
export const registerFarm = async (data) => {
  try {
    const {
      name,
      location_id,
      owner_id,
      total_area,
      water_source,
      farm_address,
      country_id,
      district_id,
      pond_count
    } = data;
    if (
      !name ||
      !location_id ||
      !owner_id ||
      !total_area ||
      !water_source ||
      !farm_address ||
      !country_id ||
      !district_id ||
      !pond_count
    ) {
      throw new Error("All fields are required");
    }
    
    const farm = await createFarm({
      name,
      location_id,
      owner_id,
      total_area,
      water_source,
      farm_address,
      country_id,
      district_id,
      pond_count
    });
    return farm;
  } catch (error) {
    throw new Error(error.message);
  }
};
