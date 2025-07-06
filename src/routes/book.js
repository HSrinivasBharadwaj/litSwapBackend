const express = require("express");
const verifyToken = require("../middlewares/auth");
const Book = require("../models/book");
const bookRouter = express.Router();

//Get All Books
bookRouter.get("/view/allbooks", verifyToken, async (req, res) => {
  try {
    const fetchAllBooks = await Book.find({}).populate(
      "listedBy",
      "firstName lastName email"
    );
    if (fetchAllBooks.length === 0) {
      return res.status(404).json({
        message: "No books found",
        books: [],
      });
    }
    return res
      .status(200)
      .json({ message: "Fetched All The Books", data: fetchAllBooks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Book By Id
bookRouter.get("/view/book/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const fetchBookById = await Book.findById(id).populate(
      "listedBy",
      "firstName lastName email"
    );
    if (!fetchBookById) {
      return res
        .status(404) // Changed from 400 to 404
        .json({ message: "Book not found", book: null });
    }
    return res
      .status(200)
      .json({ message: "Book fetched successfully", data: fetchBookById });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Post Book
bookRouter.post("/post/book", verifyToken, async (req, res) => {
  try {
    console.log("req",req.body)
    const loggedInUser = req.user;
    const { title, author, description, genre, condition, status } = req.body;

    if (!title || !author || !genre || !condition || !status) {
      return res.status(400).json({
        message:
          "All fields (Title, Author, Genre, Condition, Status) are required.",
      });
    }

    const ALLOWED_STATUS_UPDATES = ["Available", "pending", "swapped"];
    if (!ALLOWED_STATUS_UPDATES.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Allowed values are: Available, pending, swapped.",
      });
    }

    const ALLOWED_CONDITION_UPDATES = [
      "New",
      "like-new",
      "good",
      "fair",
      "poor",
    ];
    if (!ALLOWED_CONDITION_UPDATES.includes(condition)) {
      return res.status(400).json({
        message:
          "Invalid Condition. Allowed values are: New, like-new, good, fair, poor",
      });
    }

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedDescription = description ? description.trim() : ""; // Handle undefined description
    const trimmedGenre = genre.trim();
    const trimmedCondition = condition.trim();
    const trimmedStatus = status.trim();

    const book = new Book({
      title: trimmedTitle,
      author: trimmedAuthor,
      description: trimmedDescription,
      genre: trimmedGenre,
      condition: trimmedCondition,
      status: trimmedStatus,
      listedBy: loggedInUser._id,
    });

    await book.save();
    return res
      .status(201)
      .json({ message: "Posted the Book Successfully", data: book });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Edit Book By Owner
bookRouter.patch("/edit/book/:id", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { id } = req.params;
    const findBookId = await Book.findById(id);

    if (!findBookId) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { listedBy } = findBookId;

    if (loggedInUser._id.toString() !== listedBy.toString()) {
      return res
        .status(403)
        .json({ message: "You don't have access to edit this book" });
    }

    const ALLOWED_UPDATES = [
      "title",
      "author",
      "genre",
      "description",
      "condition",
      "status",
    ];

    Object.keys(req.body).forEach((field) => {
      if (ALLOWED_UPDATES.includes(field)) {
        findBookId[field] = req.body[field];
      }
    });

    await findBookId.save();
    return res
      .status(200)
      .json({ message: "Book updated successfully", data: findBookId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Delete Book By Owner
bookRouter.delete("/delete/book/:id", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { id } = req.params;
    const findBookById = await Book.findById(id);

    if (!findBookById) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { listedBy } = findBookById;

    if (loggedInUser._id.toString() !== listedBy.toString()) {
      return res
        .status(403)
        .json({ message: "You don't have access to delete this book" });
    }

    const bookToDelete = await Book.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Book deleted successfully",
      data: bookToDelete,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//View My Books
bookRouter.get("/view/mybooks", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const myBooks = await Book.find({
      listedBy: loggedInUser._id,
    }).populate("listedBy", "firstName lastName email");
    return res.status(200).json({ 
      message: "Your books fetched successfully", 
      data: myBooks 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = bookRouter;
