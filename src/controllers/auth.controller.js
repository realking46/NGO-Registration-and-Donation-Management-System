import { createUser, findUserByEmail } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(name, email, passwordHash);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.email === process.env.SUPERADMIN_EMAIL) {
      user.is_admin = true;
    }
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials hash " });
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (user.rows.length === 0) {
    return res.json({ message: "If user exists, reset link sent" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await pool.query(
    `UPDATE users SET reset_token=$1, reset_token_expiry=$2 WHERE email=$3`,
    [token, expiry, email]
  );

  res.json({
    message: "Password reset token generated",
    resetToken: token // shown for demo purposes
  });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await pool.query(
    `SELECT * FROM users
     WHERE reset_token=$1 AND reset_token_expiry > NOW()`,
    [token]
  );

  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users
    SET password_hash=$1, reset_token=NULL, reset_token_expiry=NULL
    WHERE id=$2`,
    [hashed, user.rows[0].id]
    );


  res.json({ message: "Password reset successful" });
};
