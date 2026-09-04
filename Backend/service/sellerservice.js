let rec = require("../model/seller");
let product = require("../model/product");
let jwt = require("jsonwebtoken");
let bct = require("bcryptjs");
let cloudinary = require("../config/cloudinary");

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(name) {
  let base = slugify(name);
  let slug = base;
  let count = 1;
  while (await product.findOne({ slug: slug })) {
    slug = `${base}-${count}`;
    count++;
  }
  return slug;
}

exports.sellerregister = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let businessName = req.body.businessName;
    let contact = req.body.contact;

    if (!name || !businessName || !email || !password) {
      return res.status(400).json({ success: false, msg: "name, businessName, email and password are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, msg: "invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, msg: "password must be at least 8 characters" });
    }

    let existing = await rec.findOne({ email: email });
    if (existing) {
      return res.status(400).json({ success: false, msg: "seller already exists" });
    }

    let hp = await bct.hash(password, 10);
    let newseller = new rec({
      email: email,
      password: hp,
      name: name,
      businessName: businessName,
      contact: contact,
    });
    await newseller.save();

    return res.status(201).json({ success: true, msg: "seller registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
};

exports.sellerlogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let data = await rec.findOne({ email: email });
    if (!data) {
      return res.status(404).json({ success: false, msg: "seller not found" });
    }

    let pass = await bct.compare(password, data.password);
    if (!pass) {
      return res.status(400).json({ success: false, msg: "seller login failed" });
    }

    let token = jwt.sign({ token: data.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ success: true, msg: "seller login successfully", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
};

exports.sellerprofile = async (req, res) => {
  const seller = req.seller;
  return res.status(200).json({
    success: true,
    profile: {
      email: seller.email,
      name: seller.name,
      businessName: seller.businessName,
      contact: seller.contact,
      id: seller._id,
    },
  });
};

exports.sellerlogout = async (req, res) => {
  res.clearCookie("selltoken");
  return res.status(200).json({ success: true, msg: "seller logout successfully" });
};

exports.sellerProducts = async (req, res) => {
  try {
    let seller = req.seller;
    let products = await product.find({ sellerId: seller._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    let seller = req.seller;
    let { name, brand, category, description, variants } = req.body;

    if (!name || !brand || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ success: false, msg: "name, brand and at least one variant are required" });
    }

    let slug = await uniqueSlug(name);

    let newproduct = new product({
      slug: slug,
      name: name,
      brand: brand,
      category: category || "Smartphones",
      description: description || "",
      sellerId: seller._id,
      variants: variants,
    });
    await newproduct.save();

    return res.status(201).json({ success: true, msg: "product added successfully", product: newproduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let seller = req.seller;
    let id = req.params.id;
    let { name, brand, category, description, variants } = req.body;

    let updated = await product.findOneAndUpdate(
      { _id: id, sellerId: seller._id },
      { name, brand, category, description, variants },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, msg: "product not found" });
    }

    return res.status(200).json({ success: true, msg: "product updated successfully", product: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let seller = req.seller;
    let id = req.params.id;

    let deleted = await product.findOneAndDelete({ _id: id, sellerId: seller._id });
    if (!deleted) {
      return res.status(404).json({ success: false, msg: "product not found" });
    }

    return res.status(200).json({ success: true, msg: "product deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "internal server error" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: "no image file uploaded" });
    }

    let result = await cloudinary.uploadBuffer(req.file.buffer, {
      folder: "1fi-products",
    });

    return res.status(200).json({ success: true, url: result.secure_url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "image upload failed" });
  }
};
