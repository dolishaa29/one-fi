import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../config/api';

const STEPS = [
  { number: '01', title: 'Choose a product', description: 'Pick the tech you love, in the variant that fits.' },
  { number: '02', title: 'Pick your pace', description: 'Flexible EMI plans backed by your mutual funds.' },
  { number: '03', title: 'Enjoy the upgrade', description: 'Quick checkout, transparent pricing, zero surprises.' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

// What a plan actually costs after the incentive - this is what should drive
// "which plan is best," not the sticker monthly payment alone.
const netCost = (plan) => plan.monthlyPayment * plan.tenure - plan.cashback;

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [variant, setVariant] = useState(null);
  const [plan, setPlan] = useState(null);
  const [zeroInterestOnly, setZeroInterestOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(false);
        const [productRes, listRes] = await Promise.all([
          axios.get(`${API_URL}/products/${slug}`),
          axios.get(`${API_URL}/products`),
        ]);
        const loadedProduct = productRes.data.product;
        setProduct(loadedProduct);
        setProducts(listRes.data.products || []);
        setVariant(loadedProduct.variants[0]);
        setPlan(loadedProduct.variants[0].emiPlans[0]);
        setZeroInterestOnly(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) document.title = `${product.name} | 1Fi`;
  }, [product]);

  const visiblePlans = useMemo(() => {
    if (!variant) return [];
    return zeroInterestOnly ? variant.emiPlans.filter((p) => p.interestRate === 0) : variant.emiPlans;
  }, [variant, zeroInterestOnly]);

  const bestPlan = useMemo(() => {
    if (!visiblePlans.length) return null;
    return visiblePlans.reduce((best, p) => (netCost(p) < netCost(best) ? p : best), visiblePlans[0]);
  }, [visiblePlans]);

  const hasZeroInterestPlans = variant?.emiPlans.some((p) => p.interestRate === 0);

  const chooseVariant = (nextVariant) => {
    setVariant(nextVariant);
    const pool = zeroInterestOnly ? nextVariant.emiPlans.filter((p) => p.interestRate === 0) : nextVariant.emiPlans;
    setPlan(pool[0] || nextVariant.emiPlans[0]);
  };

  const toggleZeroInterestOnly = (checked) => {
    setZeroInterestOnly(checked);
    const pool = checked ? variant.emiPlans.filter((p) => p.interestRate === 0) : variant.emiPlans;
    if (pool.length && !pool.some((p) => p._id === plan._id)) {
      setPlan(pool[0]);
    }
  };

  const handleProceed = () => {
    setNotice(`Your ${plan.tenure}-month plan at ${formatCurrency(plan.monthlyPayment)}/month is confirmed. We'll follow up to complete KYC.`);
    window.setTimeout(() => setNotice(''), 4000);
  };

  const otherProducts = products.filter((p) => p.slug !== product?.slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-neutral-100 animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-3 w-32 bg-neutral-100 animate-pulse" />
            <div className="h-10 w-64 bg-neutral-100 animate-pulse" />
            <div className="h-4 w-full bg-neutral-100 animate-pulse" />
            <div className="h-4 w-3/4 bg-neutral-100 animate-pulse" />
            <div className="h-24 w-full bg-neutral-100 animate-pulse mt-4" />
            <div className="h-48 w-full bg-neutral-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--paper)]">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-32 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 border border-neutral-300 flex items-center justify-center">
            <AlertTriangle size={20} className="text-neutral-400" />
          </div>
          <h2 className="font-display text-xl text-neutral-800">We couldn&apos;t load this product</h2>
          <p className="text-sm text-neutral-400">Make sure the API is running, then try again.</p>
          <Link
            to="/"
            className="px-6 py-2.5 border border-neutral-900 text-sm font-medium uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
          >
            Back to catalogue
          </Link>
        </div>
      </div>
    );
  }

  const diff = plan ? netCost(plan) - variant.price : 0;

  return (
    <div className="min-h-screen bg-[var(--paper)] text-neutral-900 pb-24 md:pb-0">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-6 flex items-center gap-2 text-sm text-neutral-400">
        <Link to="/" className="hover:text-neutral-700 transition-colors">All products</Link>
        <span>/</span>
        <span className="text-neutral-700">{product.name}</span>
      </div>

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid md:grid-cols-2 gap-10 md:gap-16 items-start">

        {/* Product image */}
        <div className="relative bg-white border border-neutral-200 flex items-center justify-center min-h-[380px] overflow-hidden">
          <span className="absolute top-5 left-5 text-[10px] font-medium uppercase tracking-wider text-neutral-500 border border-neutral-300 px-2.5 py-1">
            Mutual fund backed EMI
          </span>
          <img
            key={variant._id}
            src={variant.image}
            alt={`${product.name} ${variant.name}`}
            className="max-h-72 md:max-h-80 object-contain p-10 motion-safe:animate-[fadeIn_0.3s_ease-out_both]"
          />
        </div>

        {/* Product copy */}
        <div className="flex flex-col gap-6">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.2em]">
            {product.category} · {product.brand}
          </p>
          <h1 className="font-display text-4xl md:text-[2.75rem] leading-tight">{product.name}</h1>
          <p className="text-neutral-500 leading-relaxed max-w-md">{product.description}</p>

          <div className="flex items-baseline gap-3 flex-wrap pb-6 border-b border-neutral-200">
            <span className="font-display text-3xl">{formatCurrency(variant.price)}</span>
            <span className="text-sm text-neutral-400 line-through">{formatCurrency(variant.mrp)}</span>
            <span className="text-xs font-medium text-[var(--plum)] uppercase tracking-wider">
              Save {Math.round((1 - variant.price / variant.mrp) * 100)}%
            </span>
          </div>

          {/* Variant picker */}
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-medium text-neutral-400 uppercase tracking-[0.15em]">Variant</span>
              <span className="font-medium text-neutral-700">{variant.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v._id}
                  type="button"
                  aria-pressed={variant._id === v._id}
                  onClick={() => chooseVariant(v)}
                  className={`flex items-center gap-2 px-4 py-2 border text-sm transition-colors
                  ${variant._id === v._id
                      ? 'border-neutral-900 text-neutral-900 font-medium'
                      : 'border-neutral-200 text-neutral-500 hover:border-neutral-400'}`}
                >
                  <span className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ background: v.swatch }} />
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          {/* EMI plan picker */}
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-medium text-neutral-400 uppercase tracking-[0.15em]">Plan</span>
              <span className="font-medium text-neutral-700">Monthly payment</span>
            </div>

            {hasZeroInterestPlans && (
              <label className="flex items-center gap-2 mb-4 cursor-pointer select-none w-fit">
                <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${zeroInterestOnly ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={zeroInterestOnly}
                    onChange={(e) => toggleZeroInterestOnly(e.target.checked)}
                  />
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${zeroInterestOnly ? 'translate-x-4' : 'translate-x-1'}`} />
                </span>
                <span className="text-xs text-neutral-500">0% interest plans only</span>
              </label>
            )}

            <div className="flex flex-col divide-y divide-neutral-200 border border-neutral-200">
              {visiblePlans.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  aria-pressed={plan._id === p._id}
                  onClick={() => setPlan(p)}
                  className={`relative flex items-center gap-3 w-full text-left px-4 py-3.5 transition-colors
                  ${plan._id === p._id ? 'bg-neutral-50' : 'hover:bg-neutral-50/60'}`}
                >
                  <span className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0
                  ${plan._id === p._id ? 'border-neutral-900' : 'border-neutral-300'}`}>
                    {plan._id === p._id && <span className="w-2 h-2 rounded-full bg-neutral-900" />}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="font-medium text-neutral-900">
                        {formatCurrency(p.monthlyPayment)}
                        <span className="text-xs font-normal text-neutral-400"> / month</span>
                      </span>
                      {p._id === bestPlan?._id && (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--plum)]">Best value</span>
                      )}
                    </span>
                    <span className="block text-xs text-neutral-500 mt-0.5">
                      {p.tenure} months · {p.interestRate}% interest
                    </span>
                  </span>
                  {p.cashback > 0 && (
                    <span className="text-[11px] font-medium text-neutral-500 whitespace-nowrap flex items-center gap-1">
                      <Check size={12} className="text-[var(--plum)]" /> {formatCurrency(p.cashback)} cashback
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* What this plan actually costs, not just the monthly sticker number */}
            {plan && (
              <div className="mt-3 border border-neutral-200 px-4 py-3 flex flex-col gap-1.5 text-xs">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-neutral-500">
                  <span>Total payable <b className="text-neutral-900 font-medium">{formatCurrency(plan.monthlyPayment * plan.tenure)}</b></span>
                  <span>Net after cashback <b className="text-neutral-900 font-medium">{formatCurrency(netCost(plan))}</b></span>
                </div>
                <span className="font-medium text-neutral-600">
                  {Math.abs(diff) < 100
                    ? 'Same total cost as paying today'
                    : diff < 0
                      ? `${formatCurrency(Math.abs(diff))} less than paying ${formatCurrency(variant.price)} today`
                      : `${formatCurrency(diff)} more than paying ${formatCurrency(variant.price)} today, for spreading it out`}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className="hidden md:block mt-2 w-full sm:w-auto self-start px-8 py-3.5 bg-neutral-900 hover:bg-[var(--plum)] text-white text-sm font-medium uppercase tracking-[0.1em] transition-colors"
          >
            Proceed with this plan
          </button>
          <p className="text-xs text-neutral-400">No hidden charges. Subject to eligibility and KYC verification.</p>
        </div>
      </section>

      {/* Related products */}
      {otherProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-14 border-t border-neutral-200 mt-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">Explore the drop</p>
              <h2 className="font-display text-2xl">More ways to make it yours</h2>
            </div>
            <Link to="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              See full catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {otherProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 md:px-10 py-14 border-t border-neutral-200 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">The 1Fi promise</p>
          <h2 className="font-display text-2xl md:text-3xl leading-snug">
            Your money stays invested.<br />Your plans stay simple.
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-4">
              <span className="font-display italic text-xl text-[var(--plum)] w-8 shrink-0">{step.number}</span>
              <div>
                <p className="font-medium text-neutral-900">{step.title}</p>
                <p className="text-sm text-neutral-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Sticky mobile checkout bar - the primary CTA stays reachable without scrolling back up */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Selected plan</p>
          <p className="font-display text-lg">
            {formatCurrency(plan.monthlyPayment)}<span className="text-xs text-neutral-400"> /mo</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleProceed}
          className="px-6 py-3 bg-neutral-900 text-white text-sm font-medium uppercase tracking-wider transition-colors"
        >
          Proceed
        </button>
      </div>

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 max-w-[calc(100%-2rem)] bg-neutral-900 text-white text-sm px-5 py-3 motion-safe:animate-[fadeInUp_0.3s_ease-out_both]"
        >
          <Check size={16} className="text-white shrink-0" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
