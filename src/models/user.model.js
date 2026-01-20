import pool from "../config/db.js";

export const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role
  `;
  const values = [name, email, passwordHash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};
