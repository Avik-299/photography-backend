import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/create-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ email, password });

    res.json({
      message: "Admin created successfully",
      email: admin.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
