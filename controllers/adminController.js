import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

/** helper to generate JWT */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/** Register admin (temporary - remove in production) */
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin exists" });

    const admin = await Admin.create({ email, password });
    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error("registerAdmin", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** Login admin */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error("loginAdmin", error);
    res.status(500).json({ message: "Server error" });
  }
};
