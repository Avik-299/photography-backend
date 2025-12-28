import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String },
  caption: { type: String, default: "" },
});

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  coverPhoto: { type: String, default: "" },
  photos: [PhotoSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Album", AlbumSchema);
