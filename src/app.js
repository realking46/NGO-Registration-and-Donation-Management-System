import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import payhereRoutes from "./routes/payhere.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/donation", donationRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/payhere", payhereRoutes);

app.get("/", (req, res) => {
  res.send("NGO Donation System API Running");
});

export default app;
