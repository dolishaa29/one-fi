let sellermodel = require("../model/seller");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  const token = req.cookies?.selltoken || req.headers.authorization?.split(" ")[1];

  if (token == undefined || token == "") {
    return res.status(401).json({ success: false, msg: "Please login first" });
  }

  let data;
  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ success: false, msg: "invalid or expired token" });
  }

  try {
    let seller = await sellermodel.findOne({ email: data.token });
    if (!seller) return res.status(403).json({ success: false, msg: "seller not found" });

    req.seller = seller;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
}

module.exports = auth;
