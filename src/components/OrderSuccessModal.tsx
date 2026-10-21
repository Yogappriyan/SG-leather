import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  CheckCircle2, 
  MessageSquare, 
  MapPin, 
  Clock, 
  X, 
  ShieldCheck
} from 'lucide-react';
import { openWhatsApp, generateOrderWhatsAppMessage } from '../utils/whatsapp';

export const OrderSuccessModal: React.FC = () => {
  const { 
    isSuccessModalOpen, 
    setIsSuccessModalOpen, 
    latestOrder, 
    settings,
    setIsOrderTrackingOpen 
  } = useShop();

  if (!isSuccessModalOpen || !latestOrder) return null;

  const handleSendToWhatsApp = () => {
    const msg = generateOrderWhatsAppMessage(latestOrder);
    openWhatsApp(settings.retailWhatsApp1, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={() => setIsSuccessModalOpen(false)}
      />

      {/* Modal Dialog with White Background */}
      <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-stone-900">
        
        {/* Top Celebration Header */}
        <div className="bg-stone-50 p-6 text-center border-b border-stone-200 relative">
          <button
            onClick={() => setIsSuccessModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="font-brand text-2xl font-black text-black">Order Confirmed!</h2>
          <p className="text-xs text-stone-600 mt-1 font-medium">
            Thank you for shopping genuine leather directly with <strong className="text-black">SG LEATHERS</strong>.
          </p>
          <div className="mt-3 inline-block bg-black text-white px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            Order ID: #{latestOrder.id}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* WhatsApp Direct Confirmation Button */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <span className="text-xs text-emerald-900 font-bold block">
              Send this order directly to SG Leathers WhatsApp for priority dispatch!
            </span>
            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share Order on WhatsApp (+91 9840225411)</span>
            </button>
          </div>

          {/* Delivery & Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Dispatch Details:
            </h4>
            
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <span>
                  <strong>Delivering to:</strong> {latestOrder.customerName}, {latestOrder.shippingAddress.houseStreet}, {latestOrder.shippingAddress.city} - {latestOrder.shippingAddress.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-black shrink-0" />
                <span>Dispatch time: Within 24-48 hours from Periamet Factory Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span>Payment: <strong>{latestOrder.paymentMethod}</strong> (₹{latestOrder.totalAmount.toLocaleString('en-IN')})</span>
              </div>
            </div>
          </div>

          {/* Ordered Items List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Items Ordered ({latestOrder.items.length}):
            </h4>
            <div className="space-y-2">
              {latestOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={item.image} alt="" className="w-8 h-8 rounded object-cover bg-white border border-stone-200" />
                    <div className="truncate">
                      <span className="font-bold text-black block truncate">{item.name}</span>
                      <span className="text-[11px] text-stone-500">Size: {item.selectedSize} | Color: {item.selectedColor}</span>
                    </div>
                  </div>
                  <span className="font-bold text-black shrink-0 ml-2">
                    {item.quantity} x ₹{item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                setIsOrderTrackingOpen(true);
              }}
              className="flex-1 py-3 rounded-xl bg-white hover:bg-stone-100 text-black text-xs font-bold border border-stone-300 transition-colors"
            >
              Track Order Status
            </button>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="flex-1 py-3 rounded-xl bg-black hover:bg-stone-800 text-white text-xs font-black transition-colors"
            >
              Continue Shopping
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
