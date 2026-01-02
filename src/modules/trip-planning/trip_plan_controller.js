import { createTripPlanService, getAllTripService, getTripByIdService, deleteTripPlanService, updateTripPlanService, approveTripPlanService } from "./trip_plan_service.js";


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



