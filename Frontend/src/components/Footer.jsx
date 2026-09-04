import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { to: '/', label: 'Shop' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
  { to: '/seller/register', label: 'Sell on 1Fi' },
  { to: '/seller/login', label: 'Seller login' },
];

const Footer = () => (
  <footer className="bg-neutral-900 text-white/60">
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 flex flex-col md:flex-row md:items-start justify-between gap-10">
      <div className="max-w-xs">
        <span className="font-display text-2xl text-white">
          1<span className="text-(--plum-light) italic">Fi</span>
        </span>
        <p className="text-sm mt-3 leading-relaxed">
          Invest smart, live better — smartphones on EMI, paced against your own mutual fund.
        </p>
      </div>

      <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        {FOOTER_LINKS.map((link) => (
          <Link key={link.to} to={link.to} className="hover:text-white transition-colors">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>

    <div className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/40">
        <span>© 2026 1Fi Technologies</span>
        <span>Backed by real mutual fund investments</span>
      </div>
    </div>
  </footer>
);

export default Footer;
