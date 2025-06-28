const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        rqeuired: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    listedBooks: {
        type: [{type: mongoose.Schema.Types.ObjectId}],
        default: [],
        ref: "Book"
    },
    swapRequests: {
        type: [{type: mongoose.Schema.Types.ObjectId}],
        // ref: "Request",
        default: []
        //Add the reference from the Swap Model later
    }
})

module.exports = mongoose.model("User",userSchema)