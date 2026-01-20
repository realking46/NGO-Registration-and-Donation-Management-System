export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.is_admin || !req.user.permissions?.[permission]) {
      return res.status(403).json({ error: "Permission denied" });
    }
    next();
  };
};
