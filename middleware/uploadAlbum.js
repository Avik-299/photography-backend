import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const albumName = req.body.title
      .toLowerCase()
      .replace(/\s+/g, "-");

    const albumPath = `uploads/albums/${albumName}`;

    fs.mkdirSync(albumPath, { recursive: true });
    cb(null, albumPath);
  },

  filename: (req, file, cb) => {
    const isCover = !req.coverCreated;
    req.coverCreated = true;

    const ext = path.extname(file.originalname);
    cb(null, isCover ? `cover${ext}` : `${Date.now()}${ext}`);
  }
});

export const uploadAlbum = multer({ storage });
