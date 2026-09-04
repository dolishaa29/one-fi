import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, Wallet, PackageCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

const TENURES = [3, 6, 12, 24, 36, 48, 60];
const INTEREST_RATE = 10.5;

// Mirrors Backend/utils/emi.js: tenures up to 24 months are 0% interest
// (computed off the sticker price entered here), 36+ use a standard
// reducing-balance EMI at a fixed annual rate.
function estimateMonthly(price, tenure) {
  if (tenure <= 24) return Math.round(price / tenure);
  const r = INTEREST_RATE / 12 / 100;
  const factor = Math.pow(1 + r, tenure);
  return Math.round((price * r * factor) / (factor - 1));
}

const STEPS = [
  {
    icon: Smartphone,
    title: "Pick a phone",
    body: "Browse the live catalogue - any brand, any storage. Every price and plan you see comes straight from the database, nothing is hardcoded.",
  },
  {
    icon: Wallet,
    title: "Choose a plan",
    body: "Tenures of 3, 6, 12 or 24 months run at 0% interest, paced against your mutual fund. Need longer? 36-60 months are available at a fixed annual rate.",
  },
  {
    icon: PackageCheck,
    title: "Get cashback, get moving",
    body: "Cashback lands back in your fund on top of your investment returns. Your phone ships as soon as KYC clears - no extra paperwork beyond what you'd do to invest anyway.",
  },
];

const FAQS = [
  {
    q: "Is this a loan against my mutual fund?",
    a: "No. Your fund units keep growing untouched. The EMI is simply paced against your ongoing contribution capacity, not borrowed against your holdings.",
  },
  {
    q: "What happens if I miss a payment?",
    a: "The same as any EMI provider: a grace period applies, followed by late fees if it continues. We'll always notify you before anything is reported.",
  },
  {
    q: "Why are 0% plans priced off the MRP, not the discounted price?",
    a: "The upfront discount you see on a product page is a cash-purchase incentive. On a 0% plan, the cashback we pay out (which lands back in your fund) typically offsets that difference - see the exact numbers on any product page's plan breakdown.",
  },
  {
    q: "Can a seller set their own EMI plans?",
    a: "Yes - sellers on 1Fi configure tenure, interest rate, and cashback per variant when they list a product. What you see is exactly what they set.",
  },
];

const HowItWorks = () => {
  const [price, setPrice] = useState(50000);
  const [tenure, setTenure] = useState(12);

  useEffect(() => {
    document.title = "How it works | 1Fi";
  }, []);

  const monthly = useMemo(() => estimateMonthly(Math.max(price, 0) || 0, tenure), [price, tenure]);
  const total = monthly * tenure;
  const interestRate = tenure <= 24 ? 0 : INTEREST_RATE;

  return (
    <div className="bg-[var(--paper)] text-neutral-900">
      <Navbar />

      <section className="border-b border-neutral-200 py-16 md:py-20 text-center px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">The 1Fi promise</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-4">How the EMI actually works</h1>
        <p className="text-neutral-500 max-w-lg mx-auto">
          No fine print you have to hunt for. Here's exactly how a phone gets from the catalogue to your door.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20 grid md:grid-cols-3 gap-10">
        {STEPS.map((step) => (
          <div key={step.title} className="flex flex-col gap-4">
            <span className="w-12 h-12 border border-neutral-300 flex items-center justify-center text-[var(--plum)]">
              <step.icon size={20} />
            </span>
            <p className="font-display text-xl">{step.title}</p>
            <p className="text-sm text-neutral-500 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </section>

      {/* EMI calculator */}
      <section className="border-t border-neutral-200 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">Try it yourself</p>
          <h2 className="font-display text-3xl mb-8">EMI calculator</h2>

          <div className="border border-neutral-200 bg-white p-6 md:p-8 flex flex-col gap-6">
            <div>
              <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.15em] mb-2">
                Phone price
              </label>
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl text-neutral-400">₹</span>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full text-2xl font-display border-b border-neutral-300 focus:outline-none focus:border-neutral-900 py-1 transition-colors"
                />
              </div>
              <input
                type="range"
                min={5000}
                max={200000}
                step={1000}
                value={Math.min(Math.max(price, 5000), 200000)}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full mt-4 accent-[var(--plum)]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.15em] mb-3">
                Tenure
              </label>
              <div className="flex flex-wrap gap-2">
                {TENURES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tenure === t}
                    onClick={() => setTenure(t)}
                    className={`px-4 py-2 border text-sm font-medium transition-colors
                    ${tenure === t ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-neutral-900"}`}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
              <div>
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1">Monthly</p>
                <p className="font-display text-2xl">{formatCurrency(monthly)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1">Interest</p>
                <p className="font-display text-2xl">{interestRate}%</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1">Total payable</p>
                <p className="font-display text-2xl">{formatCurrency(total)}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-400">
              Estimate only, before cashback - real plans on each product page may vary by seller.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-neutral-200 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">Questions</p>
          <h2 className="font-display text-3xl mb-10">Frequently asked</h2>
          <div className="flex flex-col divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {FAQS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-neutral-900">
                  {item.q}
                  <span className="text-neutral-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-sm text-neutral-500 leading-relaxed mt-3 max-w-2xl">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl mb-2">Ready to see real plans?</h2>
            <p className="text-neutral-500 max-w-md">The catalogue is live, with real EMI plans on every variant.</p>
          </div>
          <Link
            to="/#catalogue"
            className="shrink-0 inline-flex items-center px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-[var(--plum)] text-white text-sm font-semibold transition-colors"
          >
            Browse phones
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
