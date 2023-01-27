const createTokenUser = (user) => {
  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  return tokenUser;
};
module.exports = createTokenUser;
