const express = require("express");
const validateUserData = require("../utils/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

authRouter.post("/user/signup", async (req, res) => {
  try {
    await validateUserData(req);
    const { firstName, lastName, email, password } = req.body;
    const findExistingUser = await User.findOne({ email: email });
    if (findExistingUser) {
      return res.status(409).json({
        message:
          "User with email id already exists please choose different one",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res
      .status(201)
      .json({ message: `Hey ${firstName} your account created successfully` });
  } catch (error) {
    console.log("Signup error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

authRouter.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findExistingUser = await User.findOne({ email: email });
    if (!findExistingUser) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      findExistingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign(
      { id: findExistingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Login sucessfull", token: token });
  } catch (error) {
    console.log("Login error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

authRouter.post("/user/logout", async (req, res) => {
  res.clearCookie("token", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successfully" });
});

module.exports = authRouter;
