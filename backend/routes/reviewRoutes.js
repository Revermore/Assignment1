import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import Book from "../models/Book.js";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const bookId = req.query.bookId;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  if (!bookId)
    return res.status(400).json({ error: "Missing bookId query param" });

  try {
    const reviews = await Review.find({ book: bookId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "username"); // optional

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    // Create and save the review
    const review = new Review({
      book: req.body.book,
      rating: req.body.rating,
      comment: req.body.comment,
      user: req.user.id, // Injected from token middleware
    });

    await review.save();

    // Update the book's averageRating and ratingsCount
    const book = await Book.findById(req.body.book);
    const updatedCount = (book.ratingsCount || 0) + 1;
    const updatedAvg =
      ((book.averageRating || 0) * (updatedCount - 1) + req.body.rating) /
      updatedCount;

    book.averageRating = updatedAvg;
    book.ratingsCount = updatedCount;
    await book.save();

    // Populate the review with user details before sending
    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name"
    ); // or "username" or whatever field

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error("❌ Review post error:", err);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only the review's author or admin can delete
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const book = await Book.findById(review.book);
    if (book && book.ratingsCount > 1) {
      const newCount = book.ratingsCount - 1;
      const newAvg =
        (book.averageRating * book.ratingsCount - review.rating) / newCount;

      book.ratingsCount = newCount;
      book.averageRating = newAvg;
      await book.save();
    } else if (book) {
      // If it was the only review, reset the stats
      book.ratingsCount = 0;
      book.averageRating = 0;
      await book.save();
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
