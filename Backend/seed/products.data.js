// Seed data for the products collection.
//
// Images are real product photographs, originally sourced from Wikimedia
// Commons (freely licensed) then re-hosted on Cloudinary via
// scripts/migrate-seed-images-to-cloudinary.js - Wikimedia's Special:FilePath
// redirect chain is fine for a one-off fetch but too slow (10-20s+ observed)
// to hotlink directly on a storefront. Most were candid trade-show/retail
// photos (visible stands, cables, a hand), so Cloudinary's AI background
// removal (e_background_removal) is baked into the URL to isolate the
// device on a clean white background - it's cached on Cloudinary's CDN
// after the first request, so this costs nothing at request time. The
// Nothing Phone 2 photo is the one exception: its glass/reflective back
// confuses the segmentation model, so it keeps its original background.

const iphoneSilver = "https://res.cloudinary.com/dopdnagff/image/upload/e_background_removal/v1788544338/1fi-seed/g2odxoil8oe4f1bm6cj1.jpg";
const iphoneOrange = "https://res.cloudinary.com/dopdnagff/image/upload/e_background_removal/v1788544340/1fi-seed/k1rjypdw4vt5hueoz4wp.jpg";
const iphoneBlue = "https://res.cloudinary.com/dopdnagff/image/upload/e_background_removal/v1788544342/1fi-seed/ysp8ftql8acoa1ji74jb.jpg";
const galaxyS24Ultra = "https://res.cloudinary.com/dopdnagff/image/upload/e_background_removal/v1788544344/1fi-seed/gdblmxir4nmde71qn5sm.jpg";
const pixel9ProXL = "https://res.cloudinary.com/dopdnagff/image/upload/e_background_removal/v1788544345/1fi-seed/tgwx13mtnuku6tsxdnfh.jpg";
const nothingPhone2 = "https://res.cloudinary.com/dopdnagff/image/upload/v1788544351/1fi-seed/pwevftcrossntdhcvqdr.png";
const xiaomi14Front = "https://res.cloudinary.com/dopdnagff/image/upload/e_background_removal/v1788544352/1fi-seed/iuxbpfdneefsdyizhrbe.jpg";
const xiaomi14Rear = "https://res.cloudinary.com/dopdnagff/image/upload/e_background_removal/v1788544354/1fi-seed/cnwsgt2j0jxkouax0ei0.jpg";

let { emiPlansFor } = require("../utils/emi");

// Matches the exact reference numbers from the assignment brief for the
// iPhone 17 Pro 256GB / MRP 1,34,900 / price 1,27,400 example.
let iphone17ProEmi = [
  { tenure: 3, interestRate: 0, monthlyPayment: 44967, cashback: 7500 },
  { tenure: 6, interestRate: 0, monthlyPayment: 22483, cashback: 7500 },
  { tenure: 12, interestRate: 0, monthlyPayment: 11242, cashback: 7500 },
  { tenure: 24, interestRate: 0, monthlyPayment: 5621, cashback: 7500 },
  { tenure: 36, interestRate: 10.5, monthlyPayment: 4297, cashback: 7500 },
  { tenure: 48, interestRate: 10.5, monthlyPayment: 3385, cashback: 7500 },
  { tenure: 60, interestRate: 10.5, monthlyPayment: 2842, cashback: 7500 },
];

let products = [
  {
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro",
    brand: "Apple",
    category: "Smartphones",
    description:
      "The most powerful iPhone yet, built on the A19 Pro chip with a pro camera system and a forged-titanium frame. Available on flexible EMI plans backed by your mutual fund investments.",
    variants: [
      {
        name: "256GB Silver",
        storage: "256GB",
        color: "Silver",
        swatch: "#e6e6ea",
        image: iphoneSilver,
        mrp: 134900,
        price: 127400,
        emiPlans: iphone17ProEmi,
      },
      {
        name: "256GB Cosmic Orange",
        storage: "256GB",
        color: "Cosmic Orange",
        swatch: "#b5602f",
        image: iphoneOrange,
        mrp: 134900,
        price: 127400,
        emiPlans: iphone17ProEmi,
      },
      {
        name: "256GB Deep Blue",
        storage: "256GB",
        color: "Deep Blue",
        swatch: "#28425f",
        image: iphoneBlue,
        mrp: 134900,
        price: 127400,
        emiPlans: iphone17ProEmi,
      },
      {
        name: "512GB Cosmic Orange",
        storage: "512GB",
        color: "Cosmic Orange",
        swatch: "#b5602f",
        image: iphoneOrange,
        mrp: 154900,
        price: 146400,
        emiPlans: emiPlansFor(154900, 146400, 7500),
      },
    ],
  },
  {
    slug: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    description:
      "Samsung's flagship Ultra with a built-in S Pen, a 200MP camera and a titanium frame. Get it on 0% EMI plans backed by mutual funds, with cashback on every tenure.",
    variants: [
      {
        name: "256GB",
        storage: "256GB",
        color: null,
        swatch: "#3a3a3d",
        image: galaxyS24Ultra,
        mrp: 134999,
        price: 129999,
        emiPlans: emiPlansFor(134999, 129999, 6000),
      },
      {
        name: "512GB",
        storage: "512GB",
        color: null,
        swatch: "#3a3a3d",
        image: galaxyS24Ultra,
        mrp: 149999,
        price: 143999,
        emiPlans: emiPlansFor(149999, 143999, 6000),
      },
      {
        name: "1TB",
        storage: "1TB",
        color: null,
        swatch: "#3a3a3d",
        image: galaxyS24Ultra,
        mrp: 169999,
        price: 162999,
        emiPlans: emiPlansFor(169999, 162999, 6000),
      },
    ],
  },
  {
    slug: "google-pixel-9-pro-xl",
    name: "Google Pixel 9 Pro XL",
    brand: "Google",
    category: "Smartphones",
    description:
      "Google's AI-first flagship with the Tensor G4 chip, a pro-grade triple camera and the cleanest Android experience. Backed by mutual fund EMI plans with attractive cashback.",
    variants: [
      {
        name: "128GB",
        storage: "128GB",
        color: null,
        swatch: "#1b1b1d",
        image: pixel9ProXL,
        mrp: 129999,
        price: 121999,
        emiPlans: emiPlansFor(129999, 121999, 5000),
      },
      {
        name: "256GB",
        storage: "256GB",
        color: null,
        swatch: "#1b1b1d",
        image: pixel9ProXL,
        mrp: 139999,
        price: 131999,
        emiPlans: emiPlansFor(139999, 131999, 5000),
      },
      {
        name: "512GB",
        storage: "512GB",
        color: null,
        swatch: "#1b1b1d",
        image: pixel9ProXL,
        mrp: 159999,
        price: 149999,
        emiPlans: emiPlansFor(159999, 149999, 5000),
      },
    ],
  },
  {
    slug: "nothing-phone-2",
    name: "Nothing Phone (2)",
    brand: "Nothing",
    category: "Smartphones",
    description:
      "A transparent back, the Glyph Interface, and clean Nothing OS on top of a Snapdragon 8+ Gen 1. Built different, priced flexibly with mutual fund-backed EMI.",
    variants: [
      {
        name: "128GB",
        storage: "128GB",
        color: "Dark Grey",
        swatch: "#4a4a4d",
        image: nothingPhone2,
        mrp: 49999,
        price: 44999,
        emiPlans: emiPlansFor(49999, 44999, 2500),
      },
      {
        name: "256GB",
        storage: "256GB",
        color: "Dark Grey",
        swatch: "#4a4a4d",
        image: nothingPhone2,
        mrp: 54999,
        price: 49999,
        emiPlans: emiPlansFor(54999, 49999, 2500),
      },
      {
        name: "512GB",
        storage: "512GB",
        color: "Dark Grey",
        swatch: "#4a4a4d",
        image: nothingPhone2,
        mrp: 59999,
        price: 54999,
        emiPlans: emiPlansFor(59999, 54999, 2500),
      },
    ],
  },
  {
    slug: "xiaomi-14",
    name: "Xiaomi 14",
    brand: "Xiaomi",
    category: "Smartphones",
    description:
      "A compact flagship with Leica-tuned optics and the Snapdragon 8 Gen 3, for people who want pro cameras without a phone the size of a tablet.",
    variants: [
      {
        name: "256GB",
        storage: "256GB",
        color: "Black",
        swatch: "#1c1c1e",
        image: xiaomi14Front,
        mrp: 74999,
        price: 69999,
        emiPlans: emiPlansFor(74999, 69999, 3500),
      },
      {
        name: "512GB",
        storage: "512GB",
        color: "Black",
        swatch: "#1c1c1e",
        image: xiaomi14Rear,
        mrp: 82999,
        price: 76999,
        emiPlans: emiPlansFor(82999, 76999, 3500),
      },
    ],
  },
];

module.exports = products;
