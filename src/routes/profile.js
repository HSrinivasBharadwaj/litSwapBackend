const express = require("express");
const profileRouter = express.Router();
const validateToken = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const Validator = require("validator");

//View profile - Get Request
profileRouter.get("/view/profile", validateToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { firstName, lastName, email } = loggedInUser;
    return res.status(200).json({
      message: "Fetched the profile details successfully",
      data: { firstName, lastName, email },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Edit profile
//Only he can update firstName,lastName not email and something
profileRouter.patch("/edit/profile", validateToken, async (req, res) => {
  try {
    
    const loggedInUser = req.user;
    let { firstName, lastName } = req.body;
    const ALLOWED_UPDATES = ["firstName", "lastName"]
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are mandatory." });
    }
    firstName=firstName.trim();
    lastName = lastName.trim();
    if (firstName.length < 2 || firstName.length > 100) {
      return res.status(400).json({ message: "First name must be between 2 and 100 characters." });
    }
    if (lastName.length < 2 || lastName.length > 100) {
      return res.status(400).json({ message: "Last name must be between 2 and 100 characters." });
    }
    const updates = Object.keys(req.body);
    const isUpdateAllowed = updates.every(field => ALLOWED_UPDATES.includes(field));
    if (!isUpdateAllowed) {
        return res.status(400).json({ message: "Edit was not allowed" });
    }
    loggedInUser.firstName = firstName;
    loggedInUser.lastName = lastName;
    await loggedInUser.save();
    return res.status(201).json({ message: "Profile Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Forgot password
profileRouter.patch("/forgotpassword", validateToken, async (req, res) => {
  try {
    
    const loggedInUser = req.user;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    if (
      !Validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    }
    const updatedHashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = updatedHashedPassword;
    await loggedInUser.save();
    return res
      .status(200)
      .json({ message: "New Password was updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = profileRouter;
