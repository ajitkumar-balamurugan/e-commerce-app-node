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

ReviewSchema.statics.calculateAggregate = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  // console.log(result);
  await this.model("Product").findOneAndUpdate(
    { _id: productId },
    {
      averageRating: Math.ceil(result[0]?.averageRating || 0),
      numOfReviews: result[0]?.numOfReviews || 0,
    }
  );
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAggregate(this.product);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAggregate(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);
