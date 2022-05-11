var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AddressSchema = new Schema({
  address: { type: String, required: true },
});

AddressSchema.virtual("url").get(function () {
  return "/address/" + this._id;
});

module.exports = mongoose.model("Address", AddressSchema);
