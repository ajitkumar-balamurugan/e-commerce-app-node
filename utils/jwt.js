const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = (res, user) => {
  const token = createJWT(user);
  const oneHour = 1000 * 60 * 60;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneHour),
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };
