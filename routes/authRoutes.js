const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

router.get("/logout", logout);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
