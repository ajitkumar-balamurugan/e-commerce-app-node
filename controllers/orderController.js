const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Product = require("../models/Product");
const { checkPermissions } = require("../utils");

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with ID: ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide shipping fee and tax amount"
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const { name, image, amount, product } = item;
    const dbProduct = await Product.findById(product);

    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product found with ID: ${product}`
      );
    }
    const singleCartItem = {
      name,
      image,
      price: dbProduct.price,
      amount,
      product,
    };
    subtotal += dbProduct.price * amount;
    orderItems = [...orderItems, singleCartItem];
  }

  const total = tax + shippingFee + subtotal;

  //Dummy Stripe Functionality
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "inr",
  });

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    user: req.user.userId,
    clientSecret: paymentIntent.clientSecret,
  });
  res.status(StatusCodes.CREATED).json({ order });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with ID: ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = `dummyClientSecret`;
  return { clientSecret, amount };
};
