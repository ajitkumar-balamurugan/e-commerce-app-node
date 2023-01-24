const express = require("express");
const app = express();
const morgan = require("morgan");
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
require("dotenv").config();
require("express-async-errors");

app.use(morgan("tiny"));
app.use(express.json());
app.get("/", (req, res) => {
  res.send(`Ecommerce APP`);
});

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
