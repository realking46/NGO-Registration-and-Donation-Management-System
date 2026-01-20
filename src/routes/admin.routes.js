import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";
import { requireSuperAdmin } from "../middleware/superadmin.middleware.js";
import {
  getDashboardStats,
  getAllUsers,
  getAllDonations,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", authenticate, authorizeAdmin, getDashboardStats);
router.get("/users", authenticate, authorizeAdmin, getAllUsers);
router.get("/donations", authenticate, authorizeAdmin, getAllDonations);

router.put(
  "/grant",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
    const { userId, permissions } = req.body;

    await User.findByIdAndUpdate(userId, {
      is_admin: true,
      permissions
    });

    res.json({ message: "Admin access granted" });
  }
);
router.put(
  "/revoke",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
    const { userId } = req.body;

    await User.findByIdAndUpdate(userId, {
      is_admin: false,
      permissions: {}
    });

    res.json({ message: "Admin access revoked" });
  }
);


export default router;
