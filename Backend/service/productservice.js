let rec = require("../model/product");

exports.listProducts = async (req, res) => {
  try {
    let products = await rec.find().sort({ createdAt: 1 });
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    let slug = req.params.slug;
    let product = await rec.findOne({ slug: slug });
    if (!product) {
      return res.status(404).json({ success: false, msg: "product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
};
