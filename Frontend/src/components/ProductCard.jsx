import React from 'react';
import { Link } from 'react-router-dom';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const ProductCard = ({ product, index = 0 }) => {
  const thumbnail = product.variants?.[0];
  const lowestEmi = thumbnail?.emiPlans?.length
    ? Math.min(...thumbnail.emiPlans.map((p) => p.monthlyPayment))
    : null;
  const hasZeroInterest = thumbnail?.emiPlans?.some((p) => p.interestRate === 0);

  return (
    <Link
      to={`/products/${product.slug}`}
      style={{ animationDelay: `${Math.min(index, 7) * 55}ms` }}
      className="motion-rise group flex flex-col border border-neutral-200 bg-white hover:-translate-y-1 hover:border-neutral-400 hover:shadow-[0_14px_35px_rgba(23,19,16,0.08)] transition-all duration-300"
    >
      <div className="relative aspect-square bg-neutral-50 overflow-hidden flex items-center justify-center border-b border-neutral-200">
        {hasZeroInterest && (
          <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500 border border-neutral-300 bg-white px-2 py-0.5">
            0% EMI
          </span>
        )}
        {thumbnail?.image ? (
          <img
            src={thumbnail.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2"
          />
        ) : (
          <span className="text-neutral-300 text-[10px] font-medium uppercase tracking-widest">No image</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.12em] mb-1">{product.brand}</p>
        <h3 className="font-display text-lg text-neutral-900 leading-snug mb-2">{product.name}</h3>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-neutral-500">{formatCurrency(thumbnail?.price)}</span>
          {lowestEmi && (
            <span className="text-xs font-medium text-(--plum) whitespace-nowrap">
              {formatCurrency(lowestEmi)}/mo
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
