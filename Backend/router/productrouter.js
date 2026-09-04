let express = require("express");
let router = express.Router();
const { listProducts, getProductBySlug } = require("../controller/productcontroller");

router.get("/products", listProducts);
router.get("/products/:slug", getProductBySlug);

module.exports = router;
