let mongo = require("mongoose");

let sellermodel = mongo.Schema(
  {
    email: { type: String, unique: true, index: true },
    password: { type: String },
    name: { type: String },
    businessName: { type: String },
    contact: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongo.model("seller", sellermodel);
