import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu, X, Search } from 'lucide-react';
import { API_URL } from '../config/api';

const NAV_LINKS = [
  { to: '/', label: 'Shop' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
  { to: '/seller/login', label: 'Sell on 1Fi' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const SearchResults = ({ query, results, onSelect }) => {
  if (!query.trim()) return null;
  if (results.length === 0) {
    return <p className="px-5 py-4 text-sm text-neutral-400">No phones match &quot;{query}&quot;.</p>;
  }
  return results.map((p) => (
    <button
      key={p._id}
      onClick={() => onSelect(p.slug)}
      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors text-left border-b border-neutral-100 last:border-0"
    >
      <span className="w-9 h-9 bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center shrink-0">
        {p.variants?.[0]?.image && <img src={p.variants[0].image} alt="" className="w-full h-full object-contain" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-neutral-900 truncate">{p.name}</span>
        <span className="block text-xs text-neutral-400">From {formatCurrency(p.variants?.[0]?.price)}</span>
      </span>
    </button>
  ));
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products for search:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const results = query.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : [];

  const goToProduct = (slug) => {
    setQuery('');
    setSearchOpen(false);
    setMenuOpen(false);
    navigate(`/products/${slug}`);
  };

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <header
      className={`sticky top-0 z-30 bg-neutral-900 border-b border-white/10 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_8px_28px_-12px_rgba(0,0,0,0.55)]' : ''
      }`}
    >
      <div className="h-[3px] bg-gradient-to-r from-[var(--plum)] via-(--plum-light) to-[var(--plum)]" />
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-[69px] flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-2xl tracking-tight text-white shrink-0">
          1<span className="text-(--plum-light) italic">Fi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium mx-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative py-1 transition-colors ${isActive(link.to) ? 'text-white' : 'text-white/55 hover:text-white'}`}
            >
              {link.label}
              <span
                className={`absolute left-0 right-0 -bottom-[1px] h-[2px] bg-(--plum-light) origin-left transition-transform duration-200 ${isActive(link.to) ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search"
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {searchOpen && (
              <div className="dropdown-in absolute top-full right-0 mt-3 w-80 max-w-[calc(100vw-3rem)] bg-white border border-neutral-200 rounded-2xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="p-3 border-b border-neutral-100">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search phones or brands..."
                    aria-label="Search phones"
                    className="w-full px-2 py-1.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <SearchResults query={query} results={results} onSelect={goToProduct} />
                </div>
              </div>
            )}
          </div>

          <Link
            to="/#catalogue"
            className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-white text-neutral-900 hover:bg-(--plum-light) hover:text-white text-sm font-medium transition-colors"
          >
            Browse phones
          </Link>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] border-t border-white/10 bg-neutral-900 ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 border-t-0'
        }`}
      >
        <nav className="flex flex-col text-sm font-medium text-white/60 px-6 py-3">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
              className={`flex items-center justify-between py-2.5 border-b border-white/10 transition-all duration-300 ${
                menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
              } ${isActive(link.to) ? 'text-white font-semibold' : 'hover:text-white'}`}
            >
              {link.label}
              {isActive(link.to) && <span className="w-1.5 h-1.5 rounded-full bg-(--plum-light)" />}
            </Link>
          ))}
          <Link to="/#catalogue" onClick={() => setMenuOpen(false)} className="py-3 font-semibold text-white">
            Browse phones →
          </Link>
        </nav>
      </div>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          className="md:hidden fixed inset-0 top-[72px] -z-10 bg-neutral-900/40 motion-fade"
        />
      )}
    </header>
  );
};

export default Navbar;
