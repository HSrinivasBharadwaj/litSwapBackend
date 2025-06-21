const express = require("express");
const bookRouter = express.Router();
const verifyToken = require("../middlewares/auth");
const book = require("../models/book");




//Get Request for all books
bookRouter.get("/get/books", verifyToken, async (req, res) => {
  try {
    const getAllBooks = await book
      .find({})
      .populate("listedBy", "firstName lastName email");

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
    const { id } = req.params;
    const getBookById = await book
      .findById(id)
      .populate("listedBy", "firstName lastName email");
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

//Post Books
bookRouter.post("/post/book", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { title, author, genre, description, condition, status } = req.body;
    //Trim the white space it should not take empty spaces
    if (
      !title?.trim() ||
      !author?.trim() ||
      !genre?.trim() ||
      !description.trim() ||
      !condition?.trim() ||
      !status?.trim()
    ) {
      return res.status(400).json({
        message: "Please fill all information while uploading the books",
      });
    }
    //Title should be atleast 2 characters and should not exceed 100
    if (title.length < 2 || title.length > 100) {
      return res
        .status(400)
        .json({ message: "Title should be between 2 and 100 characters" });
    }
    if (description.length < 10 || description.length > 1000) {
      return res.status(400).json({
        message: "Description should be between 10 and 1000 characters",
      });
    }
    //Validations for post requests
    if (!title || !author || !genre || !description || !condition || !status) {
      return res.status(400).json({
        message: "Please fill all information while uploading the books",
      });
    }
    //Add validations for condition and status
    const ALLOWED_CONDITION_STATUS = [
      "New",
      "like-new",
      "good",
      "fair",
      "poor",
    ];

    if (!ALLOWED_CONDITION_STATUS.includes(condition)) {
      return res.status(400).json({ message: "Invalid Condition" });
    }
    const ALLOWED_STATUS = ["Available", "pending", "swapped"];
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }
    const newBook = new book({
      title,
      author,
      genre,
      condition,
      status,
      listedBy: loggedInUser._id,
    });
    await newBook.save();
    return res
      .status(201)
      .json({ message: "Book added successfully", data: newBook });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Update Book only by owner
bookRouter.patch("/book/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user;
    const bookToUpdate = await book.findById(id);
    if (!bookToUpdate) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (bookToUpdate.listedBy.toString() !== loggedInUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this book" });
    }
    const ALLOWED_UPDATES = [
      "title",
      "author",
      "genre",
      "description",
      "condition",
      "status",
    ];
    Object.keys(req.body).forEach((key) => {
      if (ALLOWED_UPDATES.includes(key)) {
        bookToUpdate[key] = req.body[key];
      }
    });
    await bookToUpdate.save();
    return res
      .status(200)
      .json({ message: "Book updated successfully", book: bookToUpdate });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Delete book only by owner by id
bookRouter.delete("/delete/book/:id", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { id } = req.params;
    const findBookById = await book.findById(id);
    if (!findBookById) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (findBookById.listedBy.toString() !== loggedInUser._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this book" });
    }
    const bookToDelete = await book.findByIdAndDelete(id);
    return res
      .status(201)
      .json({ message: "Book deleted successfully", data: bookToDelete });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//get all the books by userId
bookRouter.get("/get/books/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const findAllBooks = await book
      .find({ listedBy: userId })
      .populate("listedBy", "firstName lastName email");

    return res
      .status(200)
      .json({ message: "Fetched all books", data: findAllBooks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /api/books/search - Search books by title, author, or genre
bookRouter.get("/get/books/search", verifyToken, async (req, res) => {
  try {
    const ALLOWED_SEARCH = ["title", "author", "genre"];
    const searchKeys = Object.keys(req.query);
    if (
      searchKeys.length === 0 ||
      !searchKeys.every((key) => ALLOWED_SEARCH.includes(key))
    ) {
      return res
        .status(400)
        .json({ message: "You can only search by title, author, or genre." });
    }
    
    const searchQuery = {
      $or: searchKeys.map((key) => ({
        [key]: { $regex: req.query[key] },
      })),
    };
    const getBookSearch = await book
      .find(searchQuery)
      .populate("listedBy", "firstName lastName email");
    return res.status(200).json({
      message: "Books fetched successfully",
      books: getBookSearch,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = bookRouter;
