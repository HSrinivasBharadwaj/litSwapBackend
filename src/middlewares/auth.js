const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedObj;
    const loggedInUser = await User.findById({ _id: id });
    if (!loggedInUser) {
      throw new Error("Not able to fetch the user");
    }
    req.user = loggedInUser;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyToken;
