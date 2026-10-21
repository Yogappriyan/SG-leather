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
    <section className="py-8 sm:py-16 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1.5 sm:mb-2 shadow-sm">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
              <span>FACTORY SPECIAL CLEARANCE</span>
            </div>
            <h2 className="font-brand text-2xl sm:text-4xl font-black text-black flex items-center gap-2">
              <span>FAMOUS FLAT-RATE ₹999 DEALS</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              SG LEATHERS signature factory outlet offerings. 100% authentic genuine leather loafers, driving moccasins, and belt/wallet gift combos at flat ₹999 pricing!
            </p>
          </div>

          <button
            onClick={onViewAllDeals}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-black hover:bg-stone-800 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <span>View All ₹999 Stock</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* 2 Column on Mobile, 4 Column on Desktop Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {flat999Products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Wholesale bulk note */}
        <div className="mt-5 sm:mt-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-stone-100 text-black flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
              ₹
            </div>
            <span className="text-stone-700 text-[11px] sm:text-xs">
              Looking for <strong>wholesale or bulk carton orders</strong> for corporate gifting or retail resale?
            </span>
          </div>
          <span className="text-black font-extrabold bg-stone-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg border border-stone-300 text-[11px] sm:text-xs text-center w-full sm:w-auto">
            Wholesale Enquiries: +91 9840525411
          </span>
        </div>

      </div>
    </section>
  );
};
