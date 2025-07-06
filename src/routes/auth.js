const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateUser = require("../utils/validate");

userRouter.post("/user/signup", async (req, res) => {
  try {
    await validateUser(req);
    const { firstName, lastName, email, password } = req.body.formData;

    const findExistingUser = await User.findOne({ email: email });
    if (findExistingUser) {
      return res
        .status(400)
        .json({ message: "Email exists, please chose different one" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).json({
      message: "User Created Successfully",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/user/login", async (req, res) => {
  try {
    console.log("req",req.body)
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required " });
    }
    const findExistingUser = await User.findOne({ email: email });
    if (!findExistingUser) {
      return res
        .status(400)
        .json({ message: "User doesn't exists, please signup" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      findExistingUser.password
    );
    if (isPasswordCorrect) {
      //Integrate the jwt logic
      const token = await jwt.sign(
        { _id: findExistingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
      });
      return res.status(200).json({
        message: "Valid Creds, Logged in",
        data: {
          firstName: findExistingUser.firstName,
          lastName: findExistingUser.lastName,
          email: findExistingUser.email,
        },
      });
    } else {
      return res.status(401).json({ message: "Invalid creds" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/user/logout", async (req, res) => {
  res.clearCookie("token", {
    maxAge: 0,
  });
  return res.status(200).json({ message: "User Loggedout Successfully" });
});

module.exports = userRouter;
