require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectToDb = require("./config/database");
const userRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const bookRouter = require('./routes/book');
const requestRouter = require("./routes/request");
const port = process.env.PORT;

app.use(cors({
  origin: "http://localhost:5173",
  credentials:true
}));
app.use(express.json());
app.use(cookieParser())

app.use("/",userRouter);
app.use("/",profileRouter);
app.use("/",bookRouter);
app.use("/", requestRouter)

connectToDb()
  .then(() => {
    app.listen(port, () => {
      console.log("Listening on port and connected to database", port);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to database", error);
  });
