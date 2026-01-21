
export const requireSuperAdmin = (req, res, next) => {
  if (req.user.email !== process.env.SUPERADMIN_EMAIL) {
    return res.status(403).json({ error: `${req.user.email}Superadmin only` });
  }
  next();
};
