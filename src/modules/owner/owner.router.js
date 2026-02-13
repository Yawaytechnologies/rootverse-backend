import express from "express";
import { createOwner, verifyOwnerController, listOwners, getOwnerController, updateOwnerController, getUsersByRootverseTypeController, updateVerification } from "./owner.controller.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = express.Router();

router.post("/owner", upload.single("profileImage"), createOwner);
router.post("/owner/:id/verify", verifyOwnerController);
router.get('/owner/fetch/:id', getOwnerController);
router.get('/owner/:rootverse_type', getUsersByRootverseTypeController);

router.get("/owner", listOwners);
router.put("/owner/:id", upload.any(), updateOwnerController);
router.put(
  "/owner/:id/verify", updateVerification
);



export default router;
