import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  MessageSquare, 
  Sparkles
} from 'lucide-react';
import { openWhatsApp, generateProductWhatsAppMessage } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    settings 
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '8');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');

  const inWishlist = isInWishlist(product.id);

  // Check if multiple images exist for subtle hover swap
  const displayImage = isHovered && product.images.length > 1 
    ? product.images[1] 
    : (product.thumbnail || product.images[0]);

  // Available stock for selected size
  const stockForSelectedSize = product.sizeStock?.[selectedSize] ?? 5;
  const isOutOfStock = stockForSelectedSize <= 0;

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = generateProductWhatsAppMessage(product, selectedColor, selectedSize);
    openWhatsApp(settings.retailWhatsApp1, message);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      setQuickViewProduct(product);
      return;
    }
    addToCart(product, selectedColor, selectedSize, 1);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-stone-200 hover:border-black transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div 
        onClick={() => setQuickViewProduct(product)}
        className="relative aspect-square w-full bg-stone-50 p-4 flex items-center justify-center cursor-pointer overflow-hidden border-b border-stone-100"
      >
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFlat999 && (
            <span className="bg-red-600 text-white font-black text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              ₹999 DEAL
            </span>
          )}
          {product.newArrival && (
            <span className="bg-black text-white font-black text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded shadow-sm">
              NEW ARRIVAL
            </span>
          )}
          {product.discountPercentage > 0 && !product.isFlat999 && (
            <span className="bg-stone-900 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${
            inWishlist 
              ? 'bg-red-600 text-white shadow-md' 
              : 'bg-white/90 text-stone-600 hover:text-black hover:bg-white shadow-sm'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image with Floating Hover Scale */}
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Hover Action Drawer (Quick View & WhatsApp) */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-black hover:bg-stone-800 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleWhatsAppEnquiry}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
            title="Chat on WhatsApp"
            aria-label="Enquire on WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Brand & Material Line */}
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1">
            <span className="uppercase tracking-wider text-black">
              {product.brand}
            </span>
            <span className="truncate max-w-[130px] text-stone-500 font-medium">
              {product.material}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="text-sm font-black text-black group-hover:text-stone-700 transition-colors line-clamp-2 leading-snug cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price Block */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg font-black text-black">
              ₹{product.salePrice.toLocaleString('en-IN')}
            </span>
            {product.price > product.salePrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] text-emerald-700 font-bold ml-auto bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Factory Direct
            </span>
          </div>

          {/* Available Sizes Pills */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1.5 font-medium">
              <span>Sizes ({product.sizeSystem}):</span>
              <span>{stockForSelectedSize > 0 ? `${stockForSelectedSize} in stock` : 'Sold out'}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => {
                const stock = product.sizeStock?.[size] ?? 5;
                const isAvail = stock > 0;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAvail) setSelectedSize(size);
                    }}
                    disabled={!isAvail}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-md border transition-all ${
                      isSelected
                        ? 'bg-black border-black text-white font-black'
                        : isAvail
                          ? 'bg-stone-50 border-stone-200 text-stone-800 hover:border-black'
                          : 'bg-stone-100 border-stone-200 text-stone-400 line-through cursor-not-allowed'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add to Cart CTA */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                : 'bg-black hover:bg-stone-800 text-white shadow-sm active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
