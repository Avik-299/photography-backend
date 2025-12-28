import multer from "multer";
import fs from "fs";
import path from "path";
import Album from "../models/Album.js";

const albumStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let folder = "uploads/default";

    // CREATE album
    if (req.body.title) {
      const slug = req.body.title
        .toLowerCase()
        .replace(/\s+/g, "-");
      folder = `uploads/${slug}`;
    }

    // ADD photos
    if (req.params.id) {
      const album = await Album.findById(req.params.id);
      if (album) folder = `uploads/${album.slug}`;
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const uploadAlbum = multer({ storage: albumStorage });
