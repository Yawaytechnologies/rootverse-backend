import { creationLocation, getLocationByIdPopulated, getLocationByDistrictId, getallLocations, updateLocationById, deleteLocationById} from "./location_model.js";




export async function createLocationService(payload) {
    const Locaton = await creationLocation(payload);
    return Locaton;
}

export async function getLocationService(id) {
    const location = await getLocationByIdPopulated(id);
    return location;
}

export async function getLocationsByDistrictService(district_id) {
    const locations = await getLocationByDistrictId(district_id);
    return locations;
}

export async function getAllLocationsService() {
    const locations = await getallLocations();
    return locations;
}

export async function updateLocationService(id, updates) {
    const location = await updateLocationById(id, updates);
    return location;
}

export async function deleteLocationService(id) {
    await deleteLocationById(id);
    return;
}