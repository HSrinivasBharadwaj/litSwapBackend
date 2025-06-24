const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    offeredBookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    }

},{timestamps:true})

module.exports = mongoose.model("Request",requestSchema)