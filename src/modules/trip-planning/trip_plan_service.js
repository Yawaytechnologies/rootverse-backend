import { createTrips, getAllTrip, getTriPlanById, updateTrip, deleteTrip, approveTripPlan, getbyownerCode } from "./trip_plan_model.js";
import { nanoid } from "nanoid";

export async function createTripPlanService(payload){
    const trip_id=`TRIP-${nanoid(10)}`;

    const data = {
        ...payload,
        trip_id,
    };

    return createTrips(data);
}

export async function getAllTripService(){
    return getAllTrip();
}

export async function getTripByIdService(id){
    return getTriPlanById(id)
}

export async function updateTripPlanService(id, updates) {
  return updateTrip(id, updates);
}

export async function deleteTripPlanService(id){
    return deleteTrip(id);


}

export async function approveTripPlanService(id) {
  return approveTripPlan(id);
}

export async function getByOwnerCodeService(owner_code){
    return getbyownerCode(owner_code)
}








