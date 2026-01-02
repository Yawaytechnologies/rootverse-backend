import express from "express"
import { createTripController, getTripPlanController, getalTripController, updateTipController,deleteTripController, approveTripPlanController} from "./trip_plan_controller.js"


const router = express.Router()

router.post('/trip', createTripController);
router.get('/trip', getalTripController);
router.get('/trip/:id', getTripPlanController);
router.put('/trip', updateTipController);
router.delete('/trip',deleteTripController);
router.put('/trip/:id/approve', approveTripPlanController)



export default router;