import pool from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const donations = await pool.query(
      "SELECT COALESCE(SUM(amount),0) FROM donations WHERE status='SUCCESS'"
    );

    res.json({
      totalUsers: users.rows[0].count,
      totalDonations: donations.rows[0].coalesce,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, role, created_at FROM users"
    );
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await pool.query(`
      SELECT d.id, u.name, u.email, d.amount, d.status, d.created_at
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `);
    res.json(donations.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
