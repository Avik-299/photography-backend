import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// TEMP register route - remove if you create admin via DB

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

export default router;
