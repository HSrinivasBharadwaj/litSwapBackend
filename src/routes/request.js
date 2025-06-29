const express = require("express");
const verifyToken = require("../middlewares/auth");
const Request = require("../models/request");
const Book = require("../models/book");
const requestRouter = express.Router();

//Send Request - post

requestRouter.post("/send/request", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id;
    const { bookId, offeredBookId } = req.body;
    if (!bookId || !offeredBookId) {
      return res.status(400).json({
        message: "bookId and offeredBookId are required",
      });
    }
    if (
      !mongoose.isValidObjectId(bookId) ||
      !mongoose.isValidObjectId(offeredBookId)
    ) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid bookId or offeredBookId" });
    }
    const findBookOfOwner = await Book.findById(bookId);
    if (!findBookOfOwner) {
      return res.status(400).json({ message: "Requested Book not found...." });
    }
    const toUserId = findBookOfOwner.listedBy;
    //Prevent self-request
    if (toUserId.toString() === fromUserId.toString()) {
      return res.status(400).json({
        error: true,
        message: "Cannot send request for your own book",
      });
    }
    const isOfferedBookValid = await Book.findById(offeredBookId);
    if (!isOfferedBookValid) {
      return res.status(400).json({ message: "Book not found...." });
    }
    //check who owns the book
    if (
      isOfferedBookValid.listedBy.toString() !== loggedInUser._id.toString()
    ) {
      return res.status(400).json({ message: "You don't own this book" });
    }
    //Check whether if books already in active request
    const isBookInUse = await Request.findOne({
      $or: [{ bookId }, { offeredBookId }],
      status: "pending",
    });
    if (isBookInUse) {
      return res.status(400).json({
        error: true,
        message: "One of the books is already in an active request",
      });
    }
    //check if we already made an request
    const findExistingRequest = await Request.findOne({
      fromUserId,
      toUserId,
      status: "pending",
      bookId,
    });
    if (findExistingRequest) {
      return res
        .status(400)
        .json({ message: "Connection already established" });
    }
    const newRequest = await new Request({
      fromUserId,
      toUserId,
      bookId,
      offeredBookId,
    });
    await newRequest.save();
    return res
      .status(201)
      .json({ message: "Request Created Successfully", data: newRequest });
  } catch (error) {
    console.error("Error in send/request:", {
      error,
      userId: req.user._id,
      bookId: req.body.bookId,
      offeredBookId: req.body.offeredBookId,
    });
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

//Receivers Request - see all the received request
requestRouter.get("/received/requests", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const toUserId = loggedInUser._id;
    const findAllPendingRequests = await Request.find({
      toUserId,
      status: "pending",
    })
      .populate("bookId", "title author")
      .populate("offeredBookId", "title author")
      .populate("fromUserId", "username email");
    if (!findAllPendingRequests) {
      return res.status(400).json({
        message: "There are no pending requests",
        findAllPendingRequests: [],
      });
    }
    return res
      .status(200)
      .json({
        message: "Fetched All the requests",
        data: findAllPendingRequests,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Accept or Reject Request - Receivers End

module.exports = requestRouter;
