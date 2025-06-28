const mongoose = require('mongoose');
const swapRequest = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    senderbookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    requestedBookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
},{timestamps:true})


module.exports = mongoose.model("Request",swapRequest);