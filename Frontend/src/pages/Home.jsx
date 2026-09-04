import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { API_URL } from '../config/api';

const HOW_IT_WORKS = [
  { number: '01', title: 'Pick a phone', description: 'Any brand, any storage — the catalogue below is live from the database.' },
  { number: '02', title: 'Choose a plan', description: '0% interest paced against your mutual fund, or a longer tenure at a fixed rate.' },
  { number: '03', title: 'Get cashback, get moving', description: 'Cashback lands in your fund. Delivery lands at your door.' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const location = useLocation();

  useEffect(() => {
    document.title = '1Fi — Smartphones on EMI';
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Support /#catalogue links from other pages (the Navbar's "Browse phones"
  // button) - React Router doesn't auto-scroll to a hash on client-side nav.
  useEffect(() => {
    if (location.hash === '#catalogue' && !loading) {
      document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash, loading]);

  const brands = useMemo(() => ['All', ...new Set(products.map((p) => p.brand))], [products]);

  const filtered = products.filter((p) => {
    const matchesBrand = brand === 'All' || p.brand === brand;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    return matchesBrand && matchesSearch;
  });

  const heroProduct = products[0];
  const heroVariant = heroProduct?.variants?.[0];

  return (
    <div className="bg-[var(--paper)] text-neutral-900">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-neutral-200 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-4 text-center">
          <div className="motion-rise inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full pl-2 pr-4 py-1.5 mb-8 shadow-sm">
            <span className="flex -space-x-2">
              {['#e6e6ea', '#b5602f', '#28425f'].map((c) => (
                <span key={c} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
              ))}
            </span>
            <span className="text-xs font-medium text-neutral-600">Backed by real mutual fund investments</span>
          </div>

          <h1 className="motion-rise motion-delay-1 text-[2.75rem] md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6 text-neutral-900">
            The smartest way<br />to own a phone
          </h1>
          <p className="motion-rise motion-delay-2 text-neutral-500 text-lg max-w-lg mx-auto mb-9 leading-relaxed">
            EMI plans paced against your own mutual fund — 0% interest options, cashback on every plan, no paperwork drama.
          </p>
          <div className="motion-rise motion-delay-3 flex items-center justify-center gap-6 flex-wrap">
            <a
              href="#catalogue"
              className="inline-flex items-center px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-[var(--plum)] text-white text-sm font-semibold transition-colors"
            >
              Browse phones
            </a>
            <Link to="/seller/register" className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
              Sell on 1Fi →
            </Link>
          </div>
        </div>

        {/* Hero visual: product shot with a soft color halo behind it */}
        <div className="relative max-w-3xl mx-auto px-6 pb-16 md:pb-20 pt-8">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <span className="w-56 h-56 md:w-72 md:h-72 -translate-x-28 md:-translate-x-40 rounded-full bg-[color-mix(in_srgb,var(--plum)_18%,transparent)] blur-3xl" />
            <span className="w-56 h-56 md:w-72 md:h-72 translate-x-28 md:translate-x-40 rounded-full bg-amber-200/40 blur-3xl" />
          </div>
          {heroVariant && (
            <div className="relative flex items-center justify-center">
              <img src={heroVariant.image} alt={heroProduct.name} className="hero-product relative max-h-72 md:max-h-80 object-contain drop-shadow-2xl" />
            </div>
          )}
        </div>

        <div className="motion-fade motion-delay-4 max-w-4xl mx-auto px-6 md:px-10 pb-14 flex items-center justify-center gap-10 md:gap-16 flex-wrap border-t border-neutral-200 pt-10">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-neutral-900">{products.length || '—'}</p>
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1">Brands live</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-neutral-900">0%</p>
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1">Interest options</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-neutral-900">₹0</p>
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1">Hidden fees</p>
          </div>
        </div>
      </section>

      {/* Brand strip */}
      {brands.length > 1 && (
        <section className="border-b border-neutral-200 py-5">
          <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-center flex-wrap gap-x-10 gap-y-2 text-neutral-400 text-xs font-medium uppercase tracking-[0.2em]">
            {brands.filter((b) => b !== 'All').map((b) => <span key={b}>{b}</span>)}
          </div>
        </section>
      )}

      {/* Catalogue */}
      <section id="catalogue" className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">The catalogue</p>
            <h2 className="font-display text-3xl">Every phone, every plan</h2>
          </div>
          <span className="text-sm text-neutral-400">{filtered.length} of {products.length}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10 pb-6 border-b border-neutral-200">
          <div className="relative max-w-xs w-full">
            <Search size={15} className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-6 pr-6 py-2 border-b border-neutral-300 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:ml-4">
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={brand === b}
                onClick={() => setBrand(b)}
                className={`text-xs font-medium uppercase tracking-wider pb-0.5 border-b-2 transition-colors
                ${brand === b ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-700'}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-neutral-200">
            {[1, 2, 3, 4].map((n) => <div key={n} className="skeleton-shimmer aspect-[3/4] bg-neutral-50 animate-pulse" />)}
          </div>
        ) : error ? (
          <p className="text-sm text-neutral-400 py-16 text-center">Couldn&apos;t load the catalogue. Make sure the API is running.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-neutral-400 py-16 text-center">No products match your search.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, index) => <ProductCard key={p._id} product={p} index={index} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-neutral-200 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">The 1Fi promise</p>
          <h2 className="font-display text-3xl mb-14 max-w-lg">Your money stays invested. Your plans stay simple.</h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.number} className="pt-6 border-t-2 border-neutral-900">
                <p className="font-display italic text-2xl text-[var(--plum)] mb-3">{step.number}</p>
                <p className="font-medium text-lg mb-2">{step.title}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <Link to="/how-it-works" className="inline-block mt-12 text-sm font-semibold text-neutral-900 hover:text-[var(--plum)] transition-colors">
            See the full breakdown, FAQs, and an EMI calculator →
          </Link>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl mb-2">Selling phones? List them on 1Fi.</h2>
            <p className="text-neutral-500 max-w-md">Reach buyers who&apos;d rather EMI than empty their savings. Free to list.</p>
          </div>
          <Link
            to="/seller/register"
            className="shrink-0 px-8 py-3.5 border border-neutral-900 text-neutral-900 text-sm font-medium uppercase tracking-[0.1em] hover:bg-neutral-900 hover:text-white transition-colors"
          >
            Become a seller
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
