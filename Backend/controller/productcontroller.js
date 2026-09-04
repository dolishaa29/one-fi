const { listProducts, getProductBySlug } = require("../service/productservice");

exports.listProducts = async (req, res) => {
  await listProducts(req, res);
};

exports.getProductBySlug = async (req, res) => {
  await getProductBySlug(req, res);
};
