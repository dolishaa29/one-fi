let mongo = require("mongoose");

let emiplan = mongo.Schema({
  tenure: { type: Number, required: true },
  interestRate: { type: Number, default: 0 },
  monthlyPayment: { type: Number, required: true },
  cashback: { type: Number, default: 0 },
});

let variant = mongo.Schema({
  name: { type: String, required: true },
  storage: { type: String, default: null },
  color: { type: String, default: null },
  swatch: { type: String, default: "#08060d" },
  image: { type: String, required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  emiPlans: [emiplan],
});

let productmodel = mongo.Schema(
  {
    slug: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, default: "Smartphones" },
    description: { type: String, default: "" },
    sellerId: { type: mongo.Schema.Types.ObjectId, ref: "seller", default: null, index: true },
    variants: [variant],
  },
  { timestamps: true }
);

module.exports = mongo.model("product", productmodel);
