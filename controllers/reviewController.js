const { StatusCodes } = require("http-status-codes");
const Review = require("../models/Review");
const CustomError = require("../errors");
const Product = require("../models/Product");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError.NotFoundError("Enter a valid product");
  }
  const user = req.user.userId;
  const isReviewed = await Review.findOne({ product: productId, user: user });
  if (isReviewed) {
    throw new CustomError.BadRequestError(
      "You have already reviewed this product"
    );
  }
  req.body.user = user;
  const review = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate("product", "name price company")
    .populate("user", "name");
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with ID ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  checkPermissions(req.user, review.user);
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with ID ${reviewId}`);
  }
  const { title, comment, rating } = req.body;
  // const updatedReview = await review.updateOne(
  //   { title, comment, rating },
  //   { new: true, runValidators: true }
  // );
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  checkPermissions(req.user, review.user);
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with ID ${reviewId}`);
  }
  // await review.deleteOne();
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: `Review deleted successfully` });
};

//Used in product route
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
