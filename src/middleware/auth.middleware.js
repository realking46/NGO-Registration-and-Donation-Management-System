import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔴 THIS LINE IS THE MOST IMPORTANT
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      is_admin: decoded.is_admin,
      permissions: decoded.permissions
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
