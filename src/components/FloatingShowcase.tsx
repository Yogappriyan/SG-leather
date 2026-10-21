import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { Sparkles, Eye, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export const FloatingShowcase: React.FC = () => {
  const { products, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useShop();
  
  // Pick 3 representative hero products
  const floatingItems = products.slice(0, 3);
  const [activeTab, setActiveTab] = useState<number>(0);
  const currentProduct: Product = floatingItems[activeTab] || products[0];

  if (!currentProduct) return null;

  return (
    <section className="py-16 bg-white border-b border-stone-200 relative overflow-hidden bg-grid-pattern-dense">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black bg-stone-100 px-3 py-1 rounded-full mb-2 border border-stone-200">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Interactive Leather Experience</span>
            </div>
            <h2 className="font-brand text-3xl sm:text-4xl font-black text-black">
              CRAFTED IN PERIAMET. FLOATING GALLERY.
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Inspect pure grain textures, hand-waxed patinas, and durable welted soles. Select an item below to view dynamic floating previews.
            </p>
          </div>

          {/* Interactive Switchers */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200">
            {floatingItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === index 
                    ? 'bg-black text-white shadow-sm' 
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                {item.category === 'flat-999-deals' ? '₹999 Loafer' : item.category === 'boots' ? 'Chelsea Boot' : 'Derby Shoe'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Floating Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          
          {/* Left Column: Floating Image & Badges */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[340px] sm:min-h-[400px]">
            
            {/* Orbiting Floating Badge A */}
            <div className="absolute top-4 left-2 sm:left-6 z-20 animate-float-slow">
              <div className="bg-white border border-stone-200 rounded-2xl px-3.5 py-2 shadow-md flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-black">{currentProduct.material}</span>
              </div>
            </div>

            {/* Orbiting Floating Badge B */}
            <div className="absolute bottom-6 right-2 sm:right-6 z-20 animate-float-reverse">
              <div className="bg-white border border-stone-200 rounded-2xl px-3.5 py-2 shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span className="text-xs font-black text-black">
                  {currentProduct.isFlat999 ? 'Factory Clearance ₹999' : `Save ${currentProduct.discountPercentage}%`}
                </span>
              </div>
            </div>

            {/* Central Floating Shoe/Bag Image with Float & Hover Zoom */}
            <div className="relative z-10 w-full max-w-lg aspect-square flex items-center justify-center p-4">
              <img
                src={currentProduct.thumbnail || currentProduct.images[0]}
                alt={currentProduct.name}
                className="max-h-[300px] sm:max-h-[360px] w-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] hover:scale-108 transition-transform duration-700 ease-out animate-float-slow cursor-pointer"
                onClick={() => setQuickViewProduct(currentProduct)}
              />
            </div>
            
            {/* Multi-angle Thumbnails Pill */}
            {currentProduct.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-md z-20">
                {currentProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setQuickViewProduct(currentProduct)}
                    className="w-8 h-8 rounded-lg overflow-hidden border border-stone-200 hover:border-black transition-colors"
                  >
                    <img src={img} alt="Angle" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Leather Specifications & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-stone-500">
                  {currentProduct.brand} • {currentProduct.category.toUpperCase().replace('-', ' ')}
                </span>
                <button
                  onClick={() => toggleWishlist(currentProduct.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isInWishlist(currentProduct.id)
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-white border-stone-200 text-stone-400 hover:text-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(currentProduct.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h3 className="font-brand text-2xl sm:text-3xl font-black text-black leading-snug">
                {currentProduct.name}
              </h3>

              {/* Price Row */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-black text-black">
                  ₹{currentProduct.salePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-stone-400 line-through">
                  ₹{currentProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-black text-white">
                  {currentProduct.discountPercentage}% OFF
                </span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Key Features Bullet List */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 font-medium">
                {currentProduct.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Available Sizes preview */}
              <div className="mt-5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Sizes Available ({currentProduct.sizeSystem}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.sizes.map((s) => {
                    const stock = currentProduct.sizeStock?.[s] ?? 5;
                    const isAvailable = stock > 0;
                    return (
                      <span
                        key={s}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                          isAvailable
                            ? 'bg-white border-stone-200 text-black'
                            : 'bg-stone-100 border-stone-200 text-stone-400 line-through'
                        }`}
                      >
                        {s} {isAvailable ? '' : '(Sold)'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setQuickViewProduct(currentProduct)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Quick View & Select Size</span>
              </button>

              <button
                onClick={() => {
                  const firstSize = currentProduct.sizes[0] || '8';
                  const firstColor = currentProduct.colors[0] || 'Original';
                  addToCart(currentProduct, firstColor, firstSize, 1);
                }}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white hover:bg-stone-100 text-black font-bold text-xs sm:text-sm uppercase tracking-wider border border-stone-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
