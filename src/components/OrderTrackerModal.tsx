import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Search, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export const OrderTrackerModal: React.FC = () => {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, orders, settings } = useShop();
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const clean = searchId.trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === clean || o.phone.includes(clean));
    setSearchedOrder(found || null);
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received at Periamet factory' },
    { title: 'Confirmed', desc: 'Stock reserved & verified' },
    { title: 'Packed at Periamet', desc: 'Pure leather quality checked & packaged' },
    { title: 'Shipped', desc: 'Handed to courier partner' },
    { title: 'Delivered', desc: 'Delivered to your doorstep' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Packed at Periamet': return 2;
      case 'Shipped':
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOrderTrackingOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-stone-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-black" />
            <h2 className="font-brand text-lg font-black text-black">Track Factory Order</h2>
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. SGL-123456) or Phone number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl pl-10 pr-4 py-2.5 text-xs text-black placeholder-stone-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          {/* Searched Order Details */}
          {searchedOrder ? (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Order Reference</span>
                  <span className="font-mono font-black text-black text-sm">#{searchedOrder.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Current Status</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-black text-white">
                    {searchedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Step Progress Line */}
              <div className="py-2 px-3">
                <div className="relative flex flex-col space-y-6">
                  {steps.map((st, i) => {
                    const currentIndex = getStepIndex(searchedOrder.orderStatus);
                    const isDone = i <= currentIndex;
                    const isCurrent = i === currentIndex;

                    return (
                      <div key={st.title} className="flex items-start gap-4 relative">
                        {/* Circle */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 z-10 transition-colors ${
                          isDone 
                            ? 'bg-black text-white shadow-sm' 
                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>

                        {/* Text */}
                        <div>
                          <h4 className={`text-xs font-black ${isCurrent ? 'text-black' : isDone ? 'text-stone-800' : 'text-stone-400'}`}>
                            {st.title}
                          </h4>
                          <p className="text-[11px] text-stone-500">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in order */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Customer & Delivery:</span>
                <p className="text-stone-700">Name: <strong className="text-black">{searchedOrder.customerName}</strong> ({searchedOrder.phone})</p>
                <p className="text-stone-700">Address: {searchedOrder.shippingAddress.houseStreet}, {searchedOrder.shippingAddress.city} - {searchedOrder.shippingAddress.pincode}</p>
                <p className="text-stone-700">Total: <strong className="text-black font-black">₹{searchedOrder.totalAmount.toLocaleString('en-IN')}</strong> ({searchedOrder.paymentMethod})</p>
              </div>

              {/* WhatsApp Support Query */}
              <button
                onClick={() => openWhatsApp(settings.retailWhatsApp1, `Hello SG Leathers, checking dispatch status for my order #${searchedOrder.id}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-black text-xs font-bold border border-stone-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact Periamet Dispatch Team on WhatsApp</span>
              </button>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-8 text-stone-500 space-y-2">
              <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-800 font-bold">No order found matching "{searchId}".</p>
              <p className="text-[11px] text-stone-500">Please verify the Order ID or phone number used during checkout.</p>
            </div>
          ) : (
            <div className="text-center py-6 text-stone-500 text-xs">
              Enter your Order ID (from your confirmation screen or WhatsApp) to track live dispatch status from Periamet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
