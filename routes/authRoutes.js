import express from "express";
import {
  loginAdmin,
  resetAdminPassword,
} from "../controllers/authController.js";

const router = express.Router();

//router.get("/reset-admin", resetAdminPassword);
router.post("/login", loginAdmin);

export default router;
