const test = require("node:test");
const assert = require("node:assert/strict");
const { zeroInterestPlans, interestPlans, emiPlansFor } = require("../utils/emi");

test("zeroInterestPlans divides the MRP evenly across 3/6/12/24 months at 0% interest", () => {
  const plans = zeroInterestPlans(120000, 5000);

  assert.equal(plans.length, 4);
  assert.deepEqual(
    plans.map((p) => p.tenure),
    [3, 6, 12, 24]
  );
  for (const plan of plans) {
    assert.equal(plan.interestRate, 0);
    assert.equal(plan.cashback, 5000);
    assert.equal(plan.monthlyPayment, Math.round(120000 / plan.tenure));
  }
});

test("interestPlans produces 36/48/60 month tenures with a positive rate and a real reducing-balance EMI", () => {
  const plans = interestPlans(100000, 2000, 10.5);

  assert.equal(plans.length, 3);
  assert.deepEqual(
    plans.map((p) => p.tenure),
    [36, 48, 60]
  );
  for (const plan of plans) {
    assert.equal(plan.interestRate, 10.5);
    assert.equal(plan.cashback, 2000);
    // A reducing-balance EMI on a real interest rate must exceed a plain
    // interest-free division of principal by tenure.
    assert.ok(plan.monthlyPayment > 100000 / plan.tenure);
  }
  // Longer tenure -> smaller monthly payment.
  assert.ok(plans[0].monthlyPayment > plans[1].monthlyPayment);
  assert.ok(plans[1].monthlyPayment > plans[2].monthlyPayment);
});

test("emiPlansFor returns exactly 7 plans: 4 zero-interest + 3 interest-bearing", () => {
  const plans = emiPlansFor(134900, 127400, 7500);

  assert.equal(plans.length, 7);
  assert.equal(plans.filter((p) => p.interestRate === 0).length, 4);
  assert.equal(plans.filter((p) => p.interestRate > 0).length, 3);
  assert.ok(plans.every((p) => p.cashback === 7500));
  assert.ok(plans.every((p) => p.monthlyPayment > 0));
});
