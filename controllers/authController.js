const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors");
const { attachCookiesToResponse } = require("../utils");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const emailIsRegistered = await User.findOne({ email });

  if (emailIsRegistered) {
    throw new CustomError.BadRequestError("Email is already registered");
  }
  const user = await User.create({ name, email, password });
  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  res.send("Login Route");
};

const logout = async (req, res) => {
  res.send("Logout Route");
};

module.exports = { register, login, logout };
