const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const validateToken = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = validateToken;
    const loggedInUser = await User.findById({ _id: _id });
    if (!loggedInUser) {
      throw new Error("Unable to fetch the user");
    }
    req.user = loggedInUser;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyToken;
