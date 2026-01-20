import pool from "../config/db.js";

export const createDonation = async (userId, amount, orderId) => {
  const result = await pool.query(
    `INSERT INTO donations (user_id, amount, status, order_id, payment_gateway)
     VALUES ($1, $2, 'PENDING', $3, 'PAYHERE')
     RETURNING *`,
    [userId, amount, orderId]
  );
  return result.rows[0];
};

export const updateDonationStatus = async (id, status) => {
  const query = `
    UPDATE donations
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;
  const { rows } = await pool.query(query, [status, id]);
  return rows[0];
};

export const getUserDonations = async (userId) => {
  const query = `
    SELECT * FROM donations
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const getDonationById = async (id) => {
  const res = await pool.query(
    "SELECT * FROM donations WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

export const updateDonationByOrderId = async (
  orderId,
  status,
  transactionId
) => {
  const result = await pool.query(
    `UPDATE donations
     SET status = $1,
         transaction_id = $2,
         updated_at = NOW()
     WHERE order_id = $3
     RETURNING *`,
    [status, transactionId, orderId]
  );
  return result.rows[0];
};
