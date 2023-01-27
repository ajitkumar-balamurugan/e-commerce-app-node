const CustomError = require("../errors");

const checkPermissions = (requestingUser, resourceUserId) => {
  if (requestingUser.role === "admin") return;
  if (requestingUser.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Unauthorized to access this resource"
  );
};

module.exports = checkPermissions;
