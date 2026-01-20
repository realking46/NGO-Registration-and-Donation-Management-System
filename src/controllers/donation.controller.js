import {
  createDonation,
  updateDonationStatus,
  getUserDonations,
  getDonationById,
} from "../models/donation.model.js";

export const initiateDonation = async (req, res) => {
  try {
    const { amount } = req.body;
    const order_id = "DON_" + Date.now();

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    const donation = await createDonation(req.user.userId, amount ,order_id);

    res.status(201).json({
      message: "Donation initiated",
      donation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MOCK payment gateway callback
export const mockPayment = async (req, res) => {
  try {
    const { donationId, status } = req.body;

    if (!donationId || !["SUCCESS", "FAILED"].includes(status)) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const donation = await getDonationById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== "PENDING") {
      return res.status(400).json({
        message: "Donation already processed",
      });
    }

    const updated = await updateDonationStatus(donationId, status);

    res.json({
      message: "Payment status updated",
      donation: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const myDonations = async (req, res) => {
  try {
    const donations = await getUserDonations(req.user.userId);
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
