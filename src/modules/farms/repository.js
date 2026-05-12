import db from "../../shared/lib/db.js";

const TABLE = "farms";

const VERIFIED_STATUS = "Verified";

const getPondsWithQrByFarmIds = async (farmIds) => {
  if (!farmIds.length) {
    return [];
  }

  const ponds = await db("ponds as p")
    .leftJoin("aquaculture_qrs as aq", function () {
      this.on("aq.pond_id", "p.id")
        .andOn("aq.type", db.raw("?", ["pond"]))
        .andOn("aq.is_active", db.raw("?", [true]));
    })
    .whereIn("p.farm_id", farmIds)
    .select("p.*", "aq.qrs_code")
    .orderBy("p.created_at", "desc");

  return ponds.map((pond) => {
    if (pond.verification_status === VERIFIED_STATUS) {
      return pond;
    }

    const { qrs_code, ...pondWithoutQrCode } = pond;
    return pondWithoutQrCode;
  });
};

const attachPondsToFarms = async (farms) => {
  const farmList = Array.isArray(farms) ? farms : [farms].filter(Boolean);

  if (!farmList.length) {
    return farms;
  }

  const ponds = await getPondsWithQrByFarmIds(farmList.map((farm) => farm.id));
  const pondsByFarmId = ponds.reduce((groupedPonds, pond) => {
    if (!groupedPonds[pond.farm_id]) {
      groupedPonds[pond.farm_id] = [];
    }

    groupedPonds[pond.farm_id].push(pond);
    return groupedPonds;
  }, {});

  const farmsWithPonds = farmList.map((farm) => ({
    ...farm,
    ponds: pondsByFarmId[farm.id] || [],
  }));

  return Array.isArray(farms) ? farmsWithPonds : farmsWithPonds[0];
};

export const createFarm = async (data) => {
  const [farm] = await db(TABLE)
    .insert({
      farm_id: data.farm_id,
      farm_name: data.farm_name,
      address: data.address,
      farm_gate_latitude: data.farm_gate_latitude,
      farm_gate_longitude: data.farm_gate_longitude,
      water_source: data.water_source,
      farm_area_acres: data.farm_area_acres,
    })
    .returning("*");

  return farm;
};

export const getAllFarms = async () => {
  const farms = await db(TABLE).select("*").orderBy("created_at", "desc");

  return attachPondsToFarms(farms);
};

export const getFarmById = async (id) => {
  const farm = await db(TABLE).where({ id }).first();

  return attachPondsToFarms(farm);
};

export const getFarmByFarmId = async (farm_id) => {
  const farm = await db(TABLE).where({ farm_id }).first();

  return attachPondsToFarms(farm);
};

export const updateFarmById = async (id, data) => {
  const [farm] = await db(TABLE)
    .where({ id })
    .update({
      farm_id: data.farm_id,
      farm_name: data.farm_name,
      address: data.address,
      farm_gate_latitude: data.farm_gate_latitude,
      farm_gate_longitude: data.farm_gate_longitude,
      water_source: data.water_source,
      farm_area_acres: data.farm_area_acres,
      updated_at: db.fn.now(),
    })
    .returning("*");

  return farm;
};

export const deleteFarmById = async (id) => {
  return await db(TABLE).where({ id }).del();
};
