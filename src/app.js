require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectToDb = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require('./routes/profile');
const bookRouter = require('./routes/bookList');
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",bookRouter)

connectToDb()
  .then(() => {
    app.listen(port, () => {
      console.log("Listening on port and connected to database", port);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to database", error);
  });
