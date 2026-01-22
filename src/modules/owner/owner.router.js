import express from "express";
import { createOwner, verifyOwnerController, listOwners, getOwnerController, updateOwnerController, getUsersByRootverseTypeController, updateVerification } from "./owner.controller.js";
import { upload } from "../../shared/middlewares/upload.js";

const router = express.Router();

router.post("/owner", upload.single("profileImage"), createOwner);
router.post("/owner/:id/verify", verifyOwnerController);
router.get('/owner/:id', getOwnerController);
router.get('/owner/:rootverse_type', getUsersByRootverseTypeController);

router.get("/owner", listOwners);
router.put("/owner/:id", upload.any(), updateOwnerController);
router.put(
  "/owner/:id/verify",
  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "govt", maxCount: 1 },
  ]),
  updateVerification
);



export default router;
