
function zeroInterestPlans(mrp, cashback) {
  return [3, 6, 12, 24].map((tenure) => ({
    tenure,
    interestRate: 0,
    monthlyPayment: Math.round(mrp / tenure),
    cashback,
  }));
}

function interestPlans(price, cashback, annualRate = 10.5) {
  let monthlyRate = annualRate / 12 / 100;
  return [36, 48, 60].map((tenure) => {
    let factor = Math.pow(1 + monthlyRate, tenure);
    let emi = (price * monthlyRate * factor) / (factor - 1);
    return {
      tenure,
      interestRate: annualRate,
      monthlyPayment: Math.round(emi),
      cashback,
    };
  });
}

function emiPlansFor(mrp, price, cashback) {
  return [...zeroInterestPlans(mrp, cashback), ...interestPlans(price, cashback)];
}

module.exports = { zeroInterestPlans, interestPlans, emiPlansFor };
