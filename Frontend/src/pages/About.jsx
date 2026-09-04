import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, HandCoins, Store } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VALUES = [
  {
    icon: TrendingUp,
    title: 'Investment-first',
    body: 'Your mutual fund keeps growing untouched. The EMI is paced against your contribution capacity, never borrowed against your holdings.',
  },
  {
    icon: ShieldCheck,
    title: 'No fine print',
    body: 'Every price, plan, and cashback number you see comes straight from the database — nothing hardcoded, nothing hidden.',
  },
  {
    icon: HandCoins,
    title: 'Fair by default',
    body: '0% interest tenures, transparent cashback, and plans sellers configure openly — what you see is exactly what you get.',
  },
];

const STATS = [
  { value: '0%', label: 'Interest options' },
  { value: '₹0', label: 'Hidden fees' },
  { value: '100%', label: 'Live catalogue' },
];

const About = () => {
  useEffect(() => {
    document.title = 'About | 1Fi';
  }, []);

  return (
    <div className="bg-[var(--paper)] text-neutral-900">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-neutral-200 py-16 md:py-20 text-center px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">Who we are</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-4">
          Smarter EMIs, built<br className="hidden md:block" /> around your investments
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto">
          1Fi exists because buying a phone shouldn&apos;t mean pausing your savings, or paying interest for the privilege of paying later.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">Why we started</p>
          <h2 className="font-display text-3xl leading-snug">A phone upgrade shouldn&apos;t cost you your investment discipline</h2>
        </div>
        <p className="text-neutral-500 leading-relaxed">
          Traditional EMIs quietly charge interest for spreading a cost over time, and personal loans ask you to
          liquidate the very investments you&apos;ve been building. 1Fi paces your payments against your ongoing
          mutual fund contributions instead — so the fund keeps compounding, cashback lands right back into it, and
          the phone still ships as soon as KYC clears. No loan against your holdings, no paperwork beyond what
          you&apos;d do to invest anyway.
        </p>
      </section>

      {/* Values */}
      <section className="border-t border-neutral-200 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">What we stand for</p>
          <h2 className="font-display text-3xl mb-14">Built to earn trust, not just a sale</h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            {VALUES.map((v) => (
              <div key={v.title} className="pt-6 border-t-2 border-neutral-900">
                <span className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center mb-4">
                  <v.icon size={17} />
                </span>
                <p className="font-medium text-lg mb-2">{v.title}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-neutral-200 py-14">
        <div className="max-w-4xl mx-auto px-6 md:px-10 flex items-center justify-center gap-10 md:gap-16 flex-wrap">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl text-neutral-900">{s.value}</p>
              <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <span className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-[color-mix(in_srgb,var(--plum)_45%,transparent)] blur-3xl pointer-events-none" />
            <div className="relative flex items-start gap-5">
              <span className="hidden sm:flex w-12 h-12 rounded-full bg-white/10 text-white items-center justify-center shrink-0">
                <Store size={20} />
              </span>
              <div>
                <h2 className="font-display text-3xl text-white mb-2">See it for yourself</h2>
                <p className="text-white/60 max-w-md">Browse the live catalogue, or list your own phones and reach buyers who&apos;d rather EMI than empty their savings.</p>
              </div>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/#catalogue"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-neutral-900 text-sm font-semibold uppercase tracking-[0.1em] hover:bg-(--plum-light) hover:text-white transition-colors"
              >
                Browse phones
              </Link>
              <Link
                to="/seller/register"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/30 text-white text-sm font-semibold uppercase tracking-[0.1em] hover:bg-white/10 transition-colors"
              >
                Become a seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
