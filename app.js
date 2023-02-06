const express = require("express");
const app = express();
// const morgan = require("morgan");
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
require("dotenv").config();
require("express-async-errors");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//Security Packages
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

app.use(express.static("./public"));
app.use(fileUpload());

//DEVELOPMENT CODE
// app.use(morgan("tiny"));
// app.get("/", (req, res) => {
//   res.send(`Ecommerce APP`);
// });
// app.get("/api/v1", (req, res) => {
//   // console.log(req.cookies);
//   console.log(req.signedCookies);
//   res.send(`Ecommerce APP`);
// });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/order", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}.....`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
