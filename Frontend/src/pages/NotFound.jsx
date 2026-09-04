import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => (
  <div className="min-h-screen flex flex-col bg-[var(--paper)] text-neutral-900">
    <Navbar />
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
      <div className="w-14 h-14 border border-neutral-300 flex items-center justify-center mb-6">
        <Compass size={20} className="text-neutral-400" />
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">404</p>
      <h1 className="font-display text-3xl md:text-4xl mb-3">This page wandered off</h1>
      <p className="text-neutral-500 max-w-sm mb-8">
        Whatever you were looking for isn&apos;t here. It might have moved, or the link was never quite right.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-7 py-3 rounded-full bg-neutral-900 hover:bg-[var(--plum)] text-white text-sm font-semibold transition-colors"
      >
        Back to the catalogue
      </Link>
    </div>
    <Footer />
  </div>
);

export default NotFound;
