import express from "express";
import { createPayherePayment } from "../controllers/payhere.controller.js";
import { payhereNotify } from "../controllers/payhereNotify.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/payment",authenticate,  createPayherePayment);
router.post("/notify", payhereNotify);

export default router;
