// One-off migration: download the Wikimedia-hotlinked seed images and
// re-host them on Cloudinary, so the storefront doesn't depend on
// Wikimedia's Special:FilePath redirect chain (slow, sometimes 10-20s+).
// Prints a JS object mapping the original URL -> new Cloudinary URL,
// to paste into seed/products.data.js.

require("dotenv").config();
const cloudinary = require("../config/cloudinary");

const urls = [
  "https://commons.wikimedia.org/wiki/Special:FilePath/Silver_iPhone_17_Pro_Max.jpg?width=640",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Cosmic_Orange_iPhone_17_Pro_Max.jpg?width=640",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Deep_Blue_iPhone_17_Pro_Max.jpg?width=640",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_Galaxy_S24_Ultra_Backside.jpg?width=640",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Google_Pixel_9_Pro_XL_(back).jpg?width=640",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Nothing_phone_(2)_(Booredatwork.com)_013.png?width=640",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Xiaomi_14_(July_10,_2026).jpg?width=640",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Xiaomi_14_rear_(July_10,_2026).jpg?width=640",
];

async function run() {
  const mapping = {};
  for (const url of urls) {
    console.error("Fetching:", url);
    const res = await fetch(url);
    if (!res.ok) {
      console.error("  FAILED to fetch:", res.status);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const result = await cloudinary.uploadBuffer(buffer, { folder: "1fi-seed" });
    mapping[url] = result.secure_url;
    console.error("  ->", result.secure_url);
  }
  console.log(JSON.stringify(mapping, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
