let mongoose = require("mongoose");
let dotenv = require("dotenv");
dotenv.config();

let product = require("../model/product");
let products = require("./products.data");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for seeding");

  await product.deleteMany({});
  await product.insertMany(products);

  console.log(`Seeded ${products.length} products`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
