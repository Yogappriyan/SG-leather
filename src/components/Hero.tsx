import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ArrowRight, 
  Flame, 
  ShoppingBag, 
  CheckCircle2, 
  MessageSquare,
  Eye,
  MapPin
} from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

interface HeroProps {
  onExplore: (category?: string) => void;
  onShowroom: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onShowroom }) => {
  const { settings, products, setQuickViewProduct } = useShop();

  // Pick hero featured product (e.g. ₹999 deal or first footwear)
  const heroProduct = products.find(p => p.isFlat999) || products[0];

  return (
    <section className="relative overflow-hidden bg-white bg-grid-pattern border-b border-stone-200 pt-10 pb-16 lg:pt-16 lg:pb-24">
      
      {/* Background Watermark SG LEATHERS Typography */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 text-[12vw] font-black text-stone-100/60 pointer-events-none select-none tracking-tighter leading-none whitespace-nowrap z-0">
        SG LEATHERS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Text Content matching reference image */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Top Pill Badge matching reference image */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>SHOWROOM SHOWCASE • PERIAMET, CHENNAI</span>
            </div>

            {/* Headline matching reference image */}
            <div className="space-y-1">
              <h1 className="font-brand text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-black tracking-tight leading-[1.05]">
                STEP INTO <br />
                <span className="relative inline-block text-stone-700">
                  SG LEATHERS STYLE
                  <span className="absolute left-0 bottom-1 w-full h-1 sm:h-1.5 bg-black rounded-full" />
                </span>
              </h1>
            </div>

            {/* Subtitle & Value Proposition matching reference image */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
              Quality genuine leather footwear and handcrafted accessories for everyday comfort and style. Explore our direct-from-factory collection—including famous flat-rate <strong className="text-black font-bold">₹999 deals</strong>—or visit our showroom at 2nd Floor, Vepery High Road, Periamet, Chennai.
            </p>

            {/* Action Buttons matching reference image */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              {/* Primary Solid Black CTA with Bag icon */}
              <button
                onClick={() => onExplore('all')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>SHOP FOOTWEAR</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary White Button with Border */}
              <button
                onClick={() => onExplore('flat-999-deals')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-black font-bold text-xs sm:text-sm tracking-wider uppercase border border-stone-300 hover:border-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>EXPLORE NEW ARRIVALS</span>
              </button>
            </div>

            {/* Direct WhatsApp Ordering strip */}
            <div className="flex items-center gap-3 text-xs text-stone-600 pt-2 flex-wrap">
              <button
                onClick={() => openWhatsApp(settings.retailWhatsApp1, "Hello SG Leathers, I am interested in placing an order for genuine leather footwear.")}
                className="flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.retailWhatsApp1}</span>
              </button>

              <span className="text-stone-300 hidden sm:inline">•</span>

              <button
                onClick={onShowroom}
                className="flex items-center gap-1.5 text-stone-600 hover:text-black font-semibold cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-black" />
                <span>Near Indian Overseas Bank, Periamet</span>
              </button>
            </div>

          </div>

          {/* Right Floating Product Card matching reference image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Clean White Card container matching reference design */}
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group">
              
              {/* Top Header of the card: BEST SELLER badge on left, Price on right */}
              <div className="flex items-start justify-between mb-4">
                <span className="bg-black text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                  BEST SELLER
                </span>

                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-black leading-none">
                    ₹{heroProduct?.salePrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-stone-400 line-through mt-0.5">
                    ₹{heroProduct?.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Centered Floating Footwear Image on Clean White Canvas with Shadow */}
              <div 
                onClick={() => heroProduct && setQuickViewProduct(heroProduct)}
                className="relative aspect-square w-full rounded-2xl bg-stone-50 border border-stone-100 p-6 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {/* Floating animated shoe image */}
                <img
                  src={heroProduct?.thumbnail || 'https://images.unsplash.com/photo-1582895577632-4148e652a6a6?q=80&w=800&auto=format&fit=crop'}
                  alt={heroProduct?.name || 'SG Leathers Footwear'}
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] group-hover:scale-108 transition-transform duration-500 ease-out animate-float-slow"
                />

                {heroProduct?.isFlat999 && (
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider shadow">
                    ₹999 FACTORY DEAL
                  </div>
                )}
              </div>

              {/* Bottom Strip of Card matching reference */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-black truncate">
                    {heroProduct?.name}
                  </h3>
                  <span className="text-[11px] text-stone-500 block truncate">
                    {heroProduct?.material} • 100% Genuine
                  </span>
                </div>

                <button
                  onClick={() => heroProduct && setQuickViewProduct(heroProduct)}
                  className="px-4 py-2 rounded-lg bg-black hover:bg-stone-800 text-white text-xs font-black shrink-0 transition-colors cursor-pointer"
                >
                  Quick View
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* 4 Feature Highlights Grid below Hero with crisp light cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-black transition-colors">
            <h4 className="text-xs font-black text-black uppercase tracking-wider mb-1">100% Genuine Leather</h4>
            <p className="text-xs text-stone-600">Hand-selected full-grain & top-grain hides. Zero synthetic substitutes.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-black transition-colors">
            <h4 className="text-xs font-black text-black uppercase tracking-wider mb-1">Direct Factory Pricing</h4>
            <p className="text-xs text-stone-600">Famous flat ₹999 deals and direct wholesale-to-retail factory pricing.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-black transition-colors">
            <h4 className="text-xs font-black text-black uppercase tracking-wider mb-1">Periamet Heritage Hub</h4>
            <p className="text-xs text-stone-600">2nd Floor, Vepery High Road near Indian Overseas Bank, Periamet, Chennai.</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-black transition-colors">
            <h4 className="text-xs font-black text-black uppercase tracking-wider mb-1">Instant WhatsApp Orders</h4>
            <p className="text-xs text-stone-600">Direct size confirmation & doorstep dispatch via WhatsApp (+91 9840225411).</p>
          </div>
        </div>

      </div>
    </section>
  );
};
