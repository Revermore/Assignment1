import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: String,
    description: String,
    genre: String,
    coverImage: String,
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
