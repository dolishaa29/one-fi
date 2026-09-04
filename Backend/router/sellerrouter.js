let express = require("express");
let auth = require("../middleware/seller");
let upload = require("../middleware/multer");
let router = express.Router();
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
} = require("../controller/sellercontroller");

router.post("/sellerregister", sellerregister);
router.post("/sellerlogin", sellerlogin);
router.get("/sellerprofile", auth, sellerprofile);
router.get("/sellerlogout", auth, sellerlogout);

router.get("/seller/products", auth, sellerProducts);
router.post("/seller/products", auth, addProduct);
router.put("/seller/products/:id", auth, updateProduct);
router.delete("/seller/products/:id", auth, deleteProduct);

router.post("/seller/upload-image", auth, upload.single("image"), uploadImage);

module.exports = router;
