const {
  sellerregister,
  sellerlogin,
  sellerprofile,
  sellerlogout,
  sellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../service/sellerservice");

exports.sellerregister = async (req, res) => {
  await sellerregister(req, res);
};

exports.sellerlogin = async (req, res) => {
  await sellerlogin(req, res);
};

exports.sellerprofile = async (req, res) => {
  await sellerprofile(req, res);
};

exports.sellerlogout = async (req, res) => {
  await sellerlogout(req, res);
};

exports.sellerProducts = async (req, res) => {
  await sellerProducts(req, res);
};

exports.addProduct = async (req, res) => {
  await addProduct(req, res);
};

exports.updateProduct = async (req, res) => {
  await updateProduct(req, res);
};

exports.deleteProduct = async (req, res) => {
  await deleteProduct(req, res);
};

exports.uploadImage = async (req, res) => {
  await uploadImage(req, res);
};
