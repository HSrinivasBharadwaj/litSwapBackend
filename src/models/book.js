const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    genre: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        enum: ["New", "like-new", "good", "fair", "poor"]
    },
    status: {
        type: String,
        enum: ["Available", "pending", "swapped"],
        default: "Available"
    },
    listedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true})

module.exports = mongoose.model("Book",bookSchema)