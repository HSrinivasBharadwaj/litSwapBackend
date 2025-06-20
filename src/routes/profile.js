const express = require("express");
const verifyToken = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const validator = require("validator");
const profileRouter = express.Router();

//get profile
profileRouter.get("/view/profile", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { firstName, lastName, email } = loggedInUser;
    return res.status(200).json({
      message: "Profile Details",
      data: { firstName, lastName, email },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

profileRouter.post("/forgotpassword", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "Please enter the password" });
    }
    if (
      !validator.isStrongPassword(newPassword, {
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    return res.status(201).json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Edit profile
//Allow only firstname,lastname
profileRouter.patch("/profile/edit", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { firstName, lastName } = req.body;
    const ALLOWED_UPDATES = ["firstName", "lastName"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((field) =>
      ALLOWED_UPDATES.includes(field)
    );
    if (!isValidOperation) {
      return res.status(400).json({ message: "Edit was not allowed" });
    }
    if (firstName !== undefined) loggedInUser.firstName = firstName;
    if (lastName !== undefined) loggedInUser.lastName = lastName;
    await loggedInUser.save();
    return res.status(200).json({
      message: `Hey, your profile was updated successfully`,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = profileRouter;
