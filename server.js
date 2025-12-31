import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import albumRoutes from "./routes/albumRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import seedAdminRoutes from "./routes/seedAdmin.js";

dotenv.config();
const app = express();

// DB
connectDB();

// CORS
app.use(
  cors({
    origin: [
      "https://photography.sotixs.com",
      "http://localhost:5173"
    ],
    credentials: true
  })
);

app.use(express.json());

// 🔥 PATH FIX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 ENSURE uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 🔥 SERVE uploads statically
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/seed", seedAdminRoutes);

// Test
app.get("/api/test", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
