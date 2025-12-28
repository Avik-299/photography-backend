import Album from "../models/Album.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";

/**
 * CREATE ALBUM
 * - album name = folder name
 * - first image = cover
 */
export const createAlbum = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one photo required" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const photos = req.files.map((file) => ({
      url: `/uploads/${slug}/${file.filename}`,
      filename: file.filename,
      caption: "",
    }));

    const album = await Album.create({
      title,
      slug,
      photos,
      coverPhoto: photos[0].url, // ✅ FIRST IMAGE AS COVER
    });

    res.status(201).json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create album" });
  }
};


/**
 * GET ALL ALBUMS
 */
export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch albums" });
  }
};

/**
 * GET ALBUM BY SLUG
 */
export const getAlbumBySlug = async (req, res) => {
  try {
    const album = await Album.findOne({ slug: req.params.slug });
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch album" });
  }
};

/**
 * ADD PHOTOS TO EXISTING ALBUM
 */
export const addPhotos = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const newPhotos = req.files.map((file) => ({
      url: `/uploads/${album.slug}/${file.filename}`,
      filename: file.filename,
      caption: "",
    }));

    album.photos.push(...newPhotos);
    await album.save();

    res.json(album);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add photos" });
  }
};



/**
 * DELETE ALBUM
 */
export const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const folderPath = path.join(process.cwd(), "uploads", album.slug);

    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    await album.deleteOne();
    res.json({ message: "Album deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete album" });
  }
};

