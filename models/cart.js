const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  items: [
    {
      product: 
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      quantity: {
        type: Number,
        default: 1,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  _id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

CartSchema.virtual("url").get(function () {
  return `/cart/${this._id}`;
});

module.exports = mongoose.model("Cart", CartSchema);
