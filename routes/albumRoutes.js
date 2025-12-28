import express from "express";
import {
  createAlbum,
  getAlbums,
  getAlbumBySlug,
  addPhotos,
  deleteAlbum,
} from "../controllers/albumController.js";

import { uploadAlbum } from "../utils/multer.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/", getAlbums);
router.get("/:slug", getAlbumBySlug);

// Admin protected
router.post(
  "/",
  verifyAdmin,
  uploadAlbum.array("images", 50),
  createAlbum
);

router.post(
  "/:id/photos",
  verifyAdmin,
  uploadAlbum.array("images", 50),
  addPhotos
);

router.delete("/:id", verifyAdmin, deleteAlbum);

export default router;
