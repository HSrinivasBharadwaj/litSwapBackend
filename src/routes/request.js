const express = require('express');
const requestRouter = express.Router();
const swapRequest = require('../models/book');
const verifyToken = require('../middlewares/auth');

//Send Request
//Alice send Request to Bob
requestRouter.post("/send/request",verifyToken,async(req,res) => {
    try {
        const loggedInUser = req.user;
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
})


module.exports = requestRouter