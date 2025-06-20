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
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true 
    },
    location: {
        type: String
    },
    listedBooks: {
        type: [{type: mongoose.Schema.ObjectId}],
        default: []
        //Add the reference later from Books collection
    },
    swapRequests: {
        type: [{type: mongoose.Schema.ObjectId}],
        default: []
        //Add the reference from the Swap Model later
    }
})

module.exports = mongoose.model("User",userSchema);