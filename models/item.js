const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  product: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  quantity: {
    type: Number,
    default: 1,
  },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
