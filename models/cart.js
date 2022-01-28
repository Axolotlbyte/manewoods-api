const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CartSchema = new Schema({
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
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
