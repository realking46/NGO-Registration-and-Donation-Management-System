// models/user.model.js
import pool from "../config/db.js";

export const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO users (name, email, password, role, is_admin, permissions , created_at)
    VALUES ($1, $2, $3, 'USER', false, '{}', CURRENT_TIMESTAMP)
    RETURNING id, name, email, role, is_admin, permissions, created_at
  `;
  const { rows } = await pool.query(query, [name, email, passwordHash]);
  return rows[0];
};

export const getUserById = async (id) => {
  const query = `
    SELECT id, name, email, role, is_admin, permissions , created_at
    FROM users WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password, role, is_admin, permissions , created_at
    FROM users WHERE email = $1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const makeUserAdmin = async (email) => {
  const { rows } = await pool.query(
    `UPDATE users SET role='ADMIN', is_admin=true WHERE email=$1 RETURNING id, email, role`,
    [email]
  );
  return rows[0];
};

export const revokeAdmin = async (email) => {
  const { rows } = await pool.query(
    `UPDATE users SET role='USER', permissions='{}' WHERE email=$1 RETURNING id,email, role`,
    [email]
  );
  return rows[0];
};

export const updateUserPermissions = async (email, permissions) => {
  const { rows } = await pool.query(
    `UPDATE users SET permissions=$1 WHERE email=$2 RETURNING id, permissions`,
    [permissions, email]
  );
  return rows[0];
};
