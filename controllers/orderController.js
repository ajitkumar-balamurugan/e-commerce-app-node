const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
  res.send("Get all orders route");
};

const getSingleOrder = async (req, res) => {
  res.send("Get single order route");
};

const getCurrentUserOrders = async (req, res) => {
  res.send("Get current user orders route");
};

const createOrder = async (req, res) => {
  res.send("create order route");
};

const updateOrder = async (req, res) => {
  res.send("update order route");
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
