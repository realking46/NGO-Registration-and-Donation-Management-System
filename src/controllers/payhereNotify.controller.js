import crypto from "crypto";
import { updateDonationByOrderId } from "../models/donation.model.js";

export const payhereNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      amount,
      currency,
      status_code,
      md5sig,
      payment_id,
    } = req.body;

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    const local_md5sig = crypto
      .createHash("md5")
      .update(
        merchant_id +
          order_id +
          amount.toFixed(2) +
          currency +
          crypto.createHash("md5").update(merchant_secret).digest("hex").toUpperCase()
      )
      .digest("hex")
      .toUpperCase();

    if (local_md5sig !== md5sig) {
      return res.sendStatus(400);
    }

    if (status_code == "2") {
      await updateDonationByOrderId(order_id, "SUCCESS", payment_id);
    } else {
      await updateDonationByOrderId(order_id, "FAILED", payment_id);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
