import express from "express";
import { createOwner, verifyOwnerController, listOwners, getOwnerController, updateOwnerController, getUsersByRootverseTypeController, updateVerification,deleteOwnerController, getOwnerByLocationController } from "./owner.controller.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = express.Router();

// More specific routes must come before parameterized routes
router.get('/owner/fetch/:id', getOwnerController);
router.get("/owner", listOwners);
router.get('/owner/location/:location_id', getOwnerByLocationController);

router.post("/owner", upload.single("profileImage"), createOwner);
router.post("/owner/:id/verify", verifyOwnerController);
router.get('/owner/:rootverse_type', getUsersByRootverseTypeController);
router.put("/owner/:id", upload.any(), updateOwnerController);
router.put("/owner/:id/verify", updateVerification);
router.delete("/owner/:id", deleteOwnerController);

export default router;
