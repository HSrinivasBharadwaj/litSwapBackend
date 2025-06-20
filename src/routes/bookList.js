const express = require("express");
const bookRouter = express.Router();
const verifyToken = require("../middlewares/auth");
const book = require("../models/book");


// POST /api/books - Create a new book listing
// GET /api/books - Get all available books (with pagination needs to be added)
// GET /api/books/:id - Get specific book details
// PUT /api/books/:id - Update book (only by owner)
// DELETE /api/books/:id - Delete book (only by owner)
// GET /api/books/user/:userId - Get books listed by specific user
// GET /api/books/search - Search books by title, author, or genre

//Get Request for all books
bookRouter.get("/get/books", verifyToken, async (req, res) => {
  try {
    const getAllBooks = await book.find({});
    if (getAllBooks.length === 0) {
      return res.status(200).json({
        message: "No books found",
        books: [],
      });
    }
    return res
      .status(200)
      .json({ message: "Books fetched successfully", books: getAllBooks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get book By Id
bookRouter.get("/get/book/:id", verifyToken, async (req, res) => {
  try {
    const {id} = req.params
    const getBookById = await book.findById(id);
    if (!getBookById) { 
      return res.status(404).json({ 
        message: "Book not found",
        book: null,
      });
    }
    return res
      .status(200)
      .json({ message: "Books fetched successfully", book: getBookById });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = bookRouter;
