import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import Book from "../models/Book.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, author, genre, page = 1, limit = 10 } = req.query;
    console.log(search);
    console.log(author);
    console.log(genre);
    const query = {};

    // Build the query dynamically
    if (search)
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];

    if (author) query.author = { $regex: author, $options: "i" };
    if (genre) query.genre = genre; // exact match

    const skip = (page - 1) * limit;
    const books = await Book.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ title: 1 }); // Add sorting for consistency

    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      success: true,
      books,
      currentPage: parseInt(page),
      totalPages,
      totalBooks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/featured", async (req, res) => {
  try {
    console.log("Featured?");
    const books = await Book.find().sort({ averageRating: -1 }).limit(6);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/books.js or wherever your router is

export default router;
