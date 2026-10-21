import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQty, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    settings,
    setIsCheckoutOpen 
  } = useShop();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingMinAmount;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleWhatsAppBagOrder = () => {
    let msg = `*SG LEATHERS • CART ENQUIRY / ORDER*\n`;
    msg += `------------------------------------\n`;
    msg += `Hello SG Leathers Periamet, I have selected the following items in my bag:\n\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}*\n`;
      msg += `   • Size: ${item.selectedSize} | Color: ${item.selectedColor}\n`;
      msg += `   • Qty: ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}\n`;
    });
    msg += `\n*Bag Total: ₹${cartSubtotal.toLocaleString('en-IN')}*\n\n`;
    msg += `Please confirm stock at your Periamet showroom and share payment / dispatch details.`;
    
    openWhatsApp(settings.retailWhatsApp1, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sliding Drawer Container with White Background */}
      <div className="relative w-full max-w-md h-full bg-white border-l border-stone-200 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 text-stone-900">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h2 className="font-brand text-lg font-black text-black">Your Shopping Bag</h2>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-black text-white">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Congratulations! You unlocked FREE Chennai & All-India Delivery!</span>
            </div>
          ) : (
            <div>
              <span className="text-stone-700">
                Add <strong className="text-black font-black">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more to unlock <span className="text-emerald-700 font-bold">Free Shipping</span>!
              </span>
              <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-black rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mb-4 text-stone-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-brand text-lg font-black text-black mb-1">Your bag is currently empty</h3>
              <p className="text-xs max-w-xs text-stone-500 mb-6">
                Explore our factory direct footwear, genuine leather loafers, Chelsea boots, and flat ₹999 deals.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs transition-colors cursor-pointer"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-stone-200 shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-black truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                    <span>Size: <strong className="text-stone-900">{item.selectedSize}</strong></span>
                    <span>•</span>
                    <span>Color: <strong className="text-stone-900">{item.selectedColor}</strong></span>
                  </div>
                  <div className="text-xs font-black text-black mt-1">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                    className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-stone-300 bg-white rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateCartQty(item.productId, item.selectedColor, item.selectedSize, item.quantity - 1)}
                      className="px-2 py-0.5 text-stone-600 hover:text-black text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 py-0.5 text-xs font-black text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.productId, item.selectedColor, item.selectedSize, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="px-2 py-0.5 text-stone-600 hover:text-black text-xs font-bold disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions (Subtotal & Checkout) */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="text-black font-black">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span className={isFreeShipping ? 'text-emerald-700 font-bold' : 'text-stone-800'}>
                  {isFreeShipping ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-black">
                <span>Total Amount</span>
                <span className="text-black text-lg">
                  ₹{(cartSubtotal + (isFreeShipping ? 0 : 99)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppBagOrder}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Order Whole Bag via WhatsApp</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>Periamet Factory Verified</span>
              <button 
                onClick={clearCart}
                className="hover:text-red-600 transition-colors"
              >
                Clear Bag
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
