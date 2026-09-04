const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

let mongod;
let app;
let baseUrl;
let server;

test.before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const product = require("../model/product");
  const seedProducts = require("../seed/products.data");
  await product.insertMany(seedProducts);

  app = require("../app");
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://localhost:${server.address().port}/api`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
  await mongod.stop();
});

test("GET /api/products returns the seeded catalogue", async () => {
  const res = await fetch(`${baseUrl}/products`);
  const body = await res.json();

  const seedProducts = require("../seed/products.data");

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.products.length, seedProducts.length);
  assert.ok(body.products.some((p) => p.slug === "iphone-17-pro"));
});

test("GET /api/products/:slug returns one product with full variant + EMI data", async () => {
  const res = await fetch(`${baseUrl}/products/iphone-17-pro`);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.product.name, "iPhone 17 Pro");
  assert.ok(body.product.variants.length >= 2);
  assert.ok(body.product.variants[0].emiPlans.length > 0);
});

test("GET /api/products/:slug for a missing slug returns 404", async () => {
  const res = await fetch(`${baseUrl}/products/does-not-exist`);
  const body = await res.json();

  assert.equal(res.status, 404);
  assert.equal(body.success, false);
});

test("unknown routes return a JSON 404, not an HTML error page", async () => {
  const res = await fetch(`${baseUrl}/nope`);
  const body = await res.json();

  assert.equal(res.status, 404);
  assert.equal(res.headers.get("content-type").includes("application/json"), true);
  assert.equal(body.success, false);
});

test("seller flow: register, login, add/update/delete a product, and ownership enforcement", async () => {
  const email = `test-seller-${Date.now()}@example.com`;

  const registerRes = await fetch(`${baseUrl}/sellerregister`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test Seller", businessName: "Test Co", email, contact: "9000000000", password: "testpass123" }),
  });
  assert.equal(registerRes.status, 201);

  const weakPasswordRes = await fetch(`${baseUrl}/sellerregister`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "X", businessName: "Y", email: "weak@example.com", contact: "1", password: "short" }),
  });
  assert.equal(weakPasswordRes.status, 400);

  const badLoginRes = await fetch(`${baseUrl}/sellerlogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "wrongpassword" }),
  });
  assert.equal(badLoginRes.status, 400);

  const loginRes = await fetch(`${baseUrl}/sellerlogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "testpass123" }),
  });
  const login = await loginRes.json();
  assert.equal(loginRes.status, 200);
  assert.ok(login.token);
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${login.token}` };

  const noAuthRes = await fetch(`${baseUrl}/seller/products`, { headers: { Authorization: "Bearer not-a-real-token" } });
  assert.equal(noAuthRes.status, 401);

  const addRes = await fetch(`${baseUrl}/seller/products`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "Test Phone",
      brand: "TestBrand",
      variants: [{ name: "128GB", swatch: "#000000", image: "https://example.com/x.png", mrp: 20000, price: 18000, emiPlans: [{ tenure: 6, interestRate: 0, monthlyPayment: 3000, cashback: 0 }] }],
    }),
  });
  const added = await addRes.json();
  assert.equal(addRes.status, 201);
  assert.equal(added.product.slug, "test-phone");
  const productId = added.product._id;

  const publicRes = await fetch(`${baseUrl}/products/test-phone`);
  assert.equal(publicRes.status, 200);

  const updateRes = await fetch(`${baseUrl}/seller/products/${productId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({ name: "Test Phone Updated", brand: "TestBrand", variants: added.product.variants }),
  });
  const updated = await updateRes.json();
  assert.equal(updateRes.status, 200);
  assert.equal(updated.product.name, "Test Phone Updated");

  // A second seller must not be able to touch the first seller's product.
  const otherEmail = `other-seller-${Date.now()}@example.com`;
  await fetch(`${baseUrl}/sellerregister`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Other", businessName: "Other Co", email: otherEmail, contact: "9111111111", password: "testpass123" }),
  });
  const otherLoginRes = await fetch(`${baseUrl}/sellerlogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: otherEmail, password: "testpass123" }),
  });
  const otherLogin = await otherLoginRes.json();
  const otherHeaders = { Authorization: `Bearer ${otherLogin.token}` };

  const crossDeleteRes = await fetch(`${baseUrl}/seller/products/${productId}`, { method: "DELETE", headers: otherHeaders });
  assert.equal(crossDeleteRes.status, 404);

  const deleteRes = await fetch(`${baseUrl}/seller/products/${productId}`, { method: "DELETE", headers: authHeaders });
  assert.equal(deleteRes.status, 200);

  const goneRes = await fetch(`${baseUrl}/products/test-phone`);
  assert.equal(goneRes.status, 404);
});
