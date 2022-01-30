var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  images: [
    {
      _id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      isCover: {
        type: Boolean,
        default: false,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.virtual("url").get(function () {
  return "/product/" + this._id;
});

module.exports = mongoose.model("Product", ProductSchema);
