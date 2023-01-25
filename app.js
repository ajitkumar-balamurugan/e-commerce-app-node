const express = require("express");
const app = express();
const morgan = require("morgan");
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
require("dotenv").config();
require("express-async-errors");

const authRouter = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.get("/", (req, res) => {
  res.send(`Ecommerce APP`);
});
app.get("/api/v1", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
  res.send(`Ecommerce APP`);
});

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
