import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  MessageSquare, 
  ShieldCheck, 
  HelpCircle,
  Zap
} from 'lucide-react';
import { openWhatsApp, generateProductWhatsAppMessage } from '../utils/whatsapp';

export const ProductModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    settings,
    setIsCheckoutOpen 
  } = useShop();

  const product = quickViewProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors[0] || 'Default');
      setSelectedSize(product.sizes[0] || '8');
      setQuantity(1);
      setShowSizeGuide(false);
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const currentImages = product.images.length > 0 ? product.images : [product.thumbnail];
  const activeImage = currentImages[activeImageIndex] || currentImages[0];

  // Size stock
  const currentStock = product.sizeStock?.[selectedSize] ?? 5;
  const isOutOfStock = currentStock <= 0;

  const handleWhatsApp = () => {
    const message = generateProductWhatsAppMessage(product, selectedColor, selectedSize);
    openWhatsApp(settings.retailWhatsApp1, message);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const added = addToCart(product, selectedColor, selectedSize, quantity);
    if (added) {
      setQuickViewProduct(null);
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog with White Background */}
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-stone-900">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">
              {product.brand}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-semibold">Periamet Factory Outlet</span>
          </div>

          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-2xl bg-stone-50 border border-stone-200 p-6 flex items-center justify-center overflow-hidden group">
              <img
                src={activeImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-105"
              />

              {product.isFlat999 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-lg uppercase tracking-wider shadow">
                  ₹999 DEAL
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md transition-all ${
                  inWishlist 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-white/90 text-stone-500 hover:text-black border border-stone-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails Row */}
            {currentImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-stone-50 shrink-0 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-black shadow-sm scale-105' 
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Authenticity Guarantee Card */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-700">
                <span className="font-bold text-black block">100% Authentic Genuine Leather Guarantee</span>
                Directly from our Periamet workshop. Zero synthetic or bonded substitutes. 
              </div>
            </div>

          </div>

          {/* Right Column: Information & Selection */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            
            <div>
              <h1 className="font-brand text-2xl sm:text-3xl font-black text-black leading-tight">
                {product.name}
              </h1>

              <div className="mt-2 flex items-center gap-3 text-xs text-stone-500 font-semibold">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span className="text-black font-bold">{product.material}</span>
              </div>

              {/* Price Banner */}
              <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-black">
                    ₹{product.salePrice.toLocaleString('en-IN')}
                  </span>
                  {product.price > product.salePrice && (
                    <span className="ml-2.5 text-sm text-stone-400 line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-black text-white">
                  {product.discountPercentage}% OFF FACTORY RATE
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mt-5">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                    Color: <strong className="text-black font-black">{selectedColor}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedColor === color 
                            ? 'bg-black text-white border-black shadow-sm' 
                            : 'bg-white border-stone-300 text-stone-700 hover:border-black'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Select Size ({product.sizeSystem}):
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-black hover:underline flex items-center gap-1 font-bold"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Indian Footwear Size Guide</span>
                  </button>
                </div>

                {/* Size Guide Info Dropdown */}
                {showSizeGuide && (
                  <div className="mb-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1.5 animate-in fade-in">
                    <span className="font-bold text-black block">Indian & UK Footwear Sizing:</span>
                    <p>Indian sizes follow standard UK sizing. For example, India/UK 8 corresponds to EU 42 and US 9.</p>
                  </div>
                )}

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const stock = product.sizeStock?.[size] ?? 5;
                    const isAvail = stock > 0;
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          if (isAvail) setSelectedSize(size);
                        }}
                        disabled={!isAvail}
                        className={`py-2 px-2 text-xs font-bold rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-black border-black text-white font-black shadow-md'
                            : isAvail
                              ? 'bg-stone-50 border-stone-200 text-stone-800 hover:border-black'
                              : 'bg-stone-100 border-stone-200 text-stone-400 line-through cursor-not-allowed'
                        }`}
                      >
                        <span>{size}</span>
                        <span className="text-[9px] font-normal opacity-80 mt-0.5">
                          {isAvail ? `${stock} left` : 'Sold'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-stone-300 bg-white rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-stone-600 hover:text-black hover:bg-stone-100 font-black text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-black text-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="px-3 py-1 text-stone-600 hover:text-black hover:bg-stone-100 font-black text-sm disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons Row */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                      : 'bg-white hover:bg-stone-50 text-black border border-stone-300 hover:border-black shadow-sm'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Size Out of Stock' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-black hover:bg-stone-800 text-white active:scale-95'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* WhatsApp direct assistance */}
              <button
                onClick={handleWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquire or Order via WhatsApp ({settings.retailWhatsApp1})</span>
              </button>

              <div className="text-[11px] text-stone-500 text-center pt-1 font-medium">
                🚚 Free shipping on orders over ₹{settings.freeShippingMinAmount} • Dispatch in 24 hrs from Periamet
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
