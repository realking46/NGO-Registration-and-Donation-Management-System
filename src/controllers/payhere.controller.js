import crypto from "crypto";
import { createDonation } from "../models/donation.model.js";
import { getUserById } from "../models/user.model.js";

export const createPayherePayment = async (req, res) => {
  try {
    const { get_amount } = req.body;
    const amount = Number(get_amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    
    const order_id = "DON_" + Date.now();
    const currency = "INR";

    const user = await getUserById(userId);

    // 1️⃣ CREATE DONATION FIRST (ETHICAL RULE)
    await createDonation(userId, amount, order_id);

    const merchant_id = process.env.PAYHERE_MERCHANT_ID;
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    const hash = crypto
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

    res.json({
      sandbox: true,
      merchant_id,
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      notify_url: "http://localhost:5000/payhere/notify",

      order_id,
      items: "NGO Donation",
      amount,
      currency,
      hash,
      name: user.name,
      email: user.email,
      address: "N/A",
      city: "N/A",
      country: "INDIA",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
