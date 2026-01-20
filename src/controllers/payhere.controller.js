import crypto from "crypto";
import { createDonation } from "../models/donation.model.js";
import { getUserById } from "../models/user.model.js";

export const createPayherePayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const userId = req.user.userId;

    const order_id = "DON_" + Date.now();
    const payment_id = "PAY_" + crypto.randomUUID();
    const currency = "INR";

    const user = await getUserById(userId);

    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }
    await createDonation(userId, amount, order_id);

    const merchant_id = process.env.PAYHERE_MERCHANT_ID;
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    const hash = crypto
      .createHash("md5")
      .update(
        merchant_id +
          order_id +
          amount +
          currency +
          crypto
            .createHash("md5")
            .update(merchant_secret)
            .digest("hex")
            .toUpperCase()
      )
      .digest("hex")
      .toUpperCase();

    // 3️⃣ Send PayHere payload
    res.json({
      sandbox: true,
      items: "NGO Donation",
      merchant_id,
      // return_url: "http://localhost:3000/success",
      // cancel_url: "http://localhost:3000/cancel",
      // notify_url: "http://localhost:5000/payhere/notify",

      order_id,
      amount: Number(amount),
      currency,
      hash,
      payment_id,
      name: user.name,
      email: user.email,
      phone: user.phone || "0770000000",
      address: "N/A",
      city: "N/A",
      country: "INDIA",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
