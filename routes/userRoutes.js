const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router.get(
  "/",
  authenticateUser,
  authorizeRoles("admin", "owner"), //Functionality setup such that different roles can be added later
  getAllUsers
);
router.get("/showMe", authenticateUser, showCurrentUser);
router.patch("/updateUser", updateUser);
router.patch("/updateUserPassword", updateUserPassword);
router.get("/:id", authenticateUser, getSingleUser);

module.exports = router;
