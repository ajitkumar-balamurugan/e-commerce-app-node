const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id ${productId}`
    );
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: `Product removed successfully` });
};

const uploadImage = async (req, res) => {
  const productImage = req.files.image;
  if (!productImage) {
    throw new CustomError.BadRequestError("No image uploaded");
  }
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Upload an image file");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Upload an image file smaller than 1 MB"
    );
  }
  const uploadedImagePath = path.join(
    __dirname,
    `../public/uploads/${productImage.name}`
  );
  await productImage.mv(uploadedImagePath);
  console.log(req.files);
  res
    .status(StatusCodes.OK)
    .json({ msg: `Image uploaded succesfully to ${uploadedImagePath}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
