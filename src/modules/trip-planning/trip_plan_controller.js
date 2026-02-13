import { createTripPlanService, getAllTripService, getTripByIdService, deleteTripPlanService, updateTripPlanService, approveTripPlanService, getByOwnerCodeService, getByOwnerCodeAndStatusService, getAllTripPlansbyStatusService, getAllTripsByVesselIdService, completeTripPlanService } from "./trip_plan_service.js";


export async function createTripController(req, res){
    try{
        const tripPlan = await createTripPlanService(req.body);
        res.status(201).json(tripPlan);
    }catch(err){
        res.status(400).json({error:err.message})
    }

}

export async function getTripPlanController(req, res) {
  try {
    const tripPlan = await getTripByIdService(req.params.id);
    if (!tripPlan) return res.status(404).json({ error: "Not found" });
    res.json(tripPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getalTripController(req,res){
    try{
      const tripPlans = await getAllTripService();
       res.json(tripPlans);
    } catch (err) {
      res.status(400).json({ error: err.message });

    }
}

export async function updateTipController(req,res){
    try{
    const tripPlan = await updateTripPlanService(req.params.id, req.body);
    res.json(tripPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });

    }
}

export async function deleteTripController(req,res){
    try {
    await deleteTripPlanService(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

}

export async function approveTripPlanController(req, res) {
  try {
    const tripPlan = await approveTripPlanService(req.params.id);
    if (!tripPlan.length) return res.status(404).json({ error: "Not found" });
    res.json(tripPlan[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function getByOwnerCodeController(req, res) {
  try {
    const { owner_code } = req.params; // "OWN-0009"

    const tripPlan = await getByOwnerCodeService(owner_code);

    return res.status(200).json({ success: true, data: tripPlan });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

}


export async function getByOwnerCodeAndStatusController(req, res) {
  try {
    const { owner_code, approval_status} = req.params; // "OWN-0009"
    const tripPlan = await getByOwnerCodeAndStatusService(owner_code, approval_status);

    return res.status(200).json({ success: true, data: tripPlan });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export const getAllTripPlansByStatusController = async (req, res) => {
    try {
        const { status } = req.params;  
        const tripPlans = await getAllTripPlansbyStatusService(status);
        return res.status(200).json({ success: true, data: tripPlans });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getAlltripsByVesselIdController = async (req, res) => {
    try {
        const { vessel_id } = req.params;
        const tripPlans = await getAllTripsByVesselIdService(vessel_id);
        return res.status(200).json({ success: true, data: tripPlans });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


export async function completeTripPlanController(req, res) {
  try {
    const { id } = req.params;
    const tripPlan = await completeTripPlanService(req.params.id);
    if (!tripPlan.length) return res.status(404).json({ error: "Not found" });
    res.json(tripPlan[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
