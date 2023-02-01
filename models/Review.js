const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide a review title"],
      maxlength: 500,
    },
    comment: {
      type: String,
      required: [true, "Please provide a review comment"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.post("save", async function () {
  console.log("Post SAVE triggered");
});
ReviewSchema.post("remove", async function () {
  console.log("Post REMOVE triggered");
});

module.exports = mongoose.model("Review", ReviewSchema);
