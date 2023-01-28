const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authentication");

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizeRoles("admin"), createProduct);

router.post(
  "/uploadImage",
  authenticateUser,
  authorizeRoles("admin"),
  uploadImage
);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizeRoles("admin"), updateProduct)
  .delete(authenticateUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;
