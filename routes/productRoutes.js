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
const { getSingleProductReviews } = require("../controllers/reviewController");

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

router.route("/:id/reviews").get(getSingleProductReviews);
module.exports = router;
