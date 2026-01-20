export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user.email === process.env.SUPERADMIN_EMAIL) {
      return next();
    }

    if (!req.user.is_admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    if (!req.user.permissions?.[permission]) {
      return res.status(403).json({
        error: `Missing permission: ${permission}`
      });
    }
    next();
  };
};

