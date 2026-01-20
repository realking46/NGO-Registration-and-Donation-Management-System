import express from "express";
import {
  initiateDonation,
  mockPayment,
  myDonations,
} from "../controllers/donation.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/initiate", authenticate, initiateDonation);
router.post("/mock-payment", mockPayment); // gateway simulation
router.get("/my", authenticate, myDonations);

export default router;
