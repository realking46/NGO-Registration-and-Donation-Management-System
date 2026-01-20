import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";
import { requireSuperAdmin } from "../middleware/superadmin.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import {
  getDashboardStats,
  getAllUsers,
  getAllDonations,
  getUsers,
  updatePermissions
} from "../controllers/admin.controller.js";
import {
  makeUserAdmin,
  revokeAdmin,
  updateUserPermissions
} from "../models/user.model.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.get("/dashboard", authenticate, authorizeAdmin, getDashboardStats);
router.get("/users", authenticate, authorizeAdmin, getAllUsers);
router.get("/donations", authenticate, authorizeAdmin, getAllDonations);

router.put( "/grant",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
    const { email, permissions } = req.body;

    await user.findByIdAndUpdate(email, {
      is_admin: true,
      permissions
    });

    res.json({ message: "Admin access granted" });
  }
);
router.put( "/revoke",
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

router.get( "/users",
  authenticate,
  requirePermission(PERMISSIONS.VIEW_USERS),
  getUsers
);

router.patch( "/users/make-admin",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const user = await makeUserAdmin(email);
    res.json({ message: "Admin granted", user });
  }
);


router.patch( "/users/revoke-admin",
  authenticate,
  requireSuperAdmin,
  async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }
    const user = await revokeAdmin(email);
    res.json({ message: "Admin revoked", user });
  }
);

router.patch( "/users/:email/permissions",
  authenticate,
  requirePermission(PERMISSIONS.UPDATE_PERMISSIONS),
  updatePermissions
);

export default router;
