import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Flame, ArrowRight } from 'lucide-react';

interface Flat999DealsProps {
  onViewAllDeals: () => void;
}

export const Flat999Deals: React.FC<Flat999DealsProps> = ({ onViewAllDeals }) => {
  const { products } = useShop();

  const flat999Products = products.filter(p => p.isFlat999 || p.salePrice <= 999);

  if (flat999Products.length === 0) return null;

  return (
    <section className="py-16 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider mb-2 shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
              <span>FACTORY SPECIAL CLEARANCE</span>
            </div>
            <h2 className="font-brand text-3xl sm:text-4xl font-black text-black flex items-center gap-2">
              <span>FAMOUS FLAT-RATE ₹999 DEALS</span>
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              SG LEATHERS’ signature factory outlet offerings. 100% authentic genuine leather loafers, driving moccasins, and belt/wallet gift combos at flat ₹999 pricing!
            </p>
          </div>

          <button
            onClick={onViewAllDeals}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-stone-800 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <span>View All ₹999 Stock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flat999Products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Wholesale bulk note */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-black flex items-center justify-center font-black">
              ₹
            </div>
            <span className="text-stone-700">
              Looking for <strong>wholesale or bulk carton orders</strong> for corporate gifting or retail resale?
            </span>
          </div>
          <span className="text-black font-extrabold bg-stone-100 px-3.5 py-1.5 rounded-lg border border-stone-300">
            Wholesale Enquiries: +91 9840525411
          </span>
        </div>

      </div>
    </section>
  );
};
