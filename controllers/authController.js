const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const emailIsRegistered = await User.findOne({ email });

  if (emailIsRegistered) {
    throw new CustomError.BadRequestError("Email is already registered");
  }
  const user = await User.create({ name, email, password });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please enter email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("No user found");
  }
  const isAuthorized = await user.comparePassword(password);
  if (!isAuthorized) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ msg: "Logged In" });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logged Out" });
};

module.exports = { register, login, logout };
