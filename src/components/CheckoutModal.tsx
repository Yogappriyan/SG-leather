import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  MapPin, 
  User, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    settings, 
    createOrder,
    showToast 
  } = useShop();

  const isFreeShipping = cartSubtotal >= settings.freeShippingMinAmount;
  const shippingFee = isFreeShipping ? 0 : 99;
  const totalAmount = cartSubtotal + shippingFee;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [houseStreet, setHouseStreet] = useState('');
  const [areaLandmark, setAreaLandmark] = useState('');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('600003');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI QR Payment' | 'Direct WhatsApp Transfer'>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !houseStreet.trim() || !pincode.trim()) {
      showToast('Please fill in your name, WhatsApp phone number, and address.', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your bag is empty.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      createOrder({
        customerId: `CUST-${phone.slice(-4)}`,
        customerName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${phone.trim()}@customer.sgleathers.in`,
        items: cart,
        subtotal: cartSubtotal,
        discount: 0,
        shippingFee,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Pending',
        orderStatus: 'Pending',
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          houseStreet: houseStreet.trim(),
          areaLandmark: areaLandmark.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim()
        }
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error(err);
      showToast('Failed to create order. Please try again or order on WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCheckoutOpen(false)}
      />

      {/* Modal Dialog with White Background */}
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-stone-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-black" />
            <div>
              <h2 className="font-brand text-lg font-black text-black">Secure Factory Checkout</h2>
              <span className="text-[11px] text-stone-500 font-semibold">SG LEATHERS • Direct Periamet Dispatch</span>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Customer Contact Info */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5 mb-3">
              <User className="w-3.5 h-3.5" />
              <span>1. Customer Details (For WhatsApp Updates)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-stone-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9840225411"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-stone-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-stone-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>2. Delivery Address</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCity('Chennai');
                  setState('Tamil Nadu');
                  setPincode('600003');
                  setAreaLandmark('Periamet / Central');
                }}
                className="text-[11px] text-black hover:underline font-bold"
              >
                Autofill Chennai Central
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Flat / House No. & Building *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 3B, Sri Krishna Apartments, Old No. 14"
                  value={houseStreet}
                  onChange={(e) => setHouseStreet(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-stone-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Street, Area & Nearby Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Vepery High Road, Near Indian Overseas Bank"
                  value={areaLandmark}
                  onChange={(e) => setAreaLandmark(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-stone-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="600003"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5 mb-3">
              <CreditCard className="w-3.5 h-3.5" />
              <span>3. Payment Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${paymentMethod === 'Cash on Delivery' ? 'text-white' : 'text-black'}`}>
                    Cash on Delivery
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="text-black focus:ring-0"
                  />
                </div>
                <p className={`text-[11px] ${paymentMethod === 'Cash on Delivery' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Pay cash upon delivery after receiving leather parcel.
                </p>
              </label>

              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'UPI QR Payment'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${paymentMethod === 'UPI QR Payment' ? 'text-white' : 'text-black'}`}>
                    UPI QR Code
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI QR Payment'}
                    onChange={() => setPaymentMethod('UPI QR Payment')}
                    className="text-black focus:ring-0"
                  />
                </div>
                <p className={`text-[11px] ${paymentMethod === 'UPI QR Payment' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Scan via GPay / PhonePe / Paytm / BHIM app.
                </p>
              </label>

              <label 
                className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'Direct WhatsApp Transfer'
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${paymentMethod === 'Direct WhatsApp Transfer' ? 'text-white' : 'text-black'}`}>
                    WhatsApp Direct
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Direct WhatsApp Transfer'}
                    onChange={() => setPaymentMethod('Direct WhatsApp Transfer')}
                    className="text-black focus:ring-0"
                  />
                </div>
                <p className={`text-[11px] ${paymentMethod === 'Direct WhatsApp Transfer' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Confirm directly with Periamet sales executive.
                </p>
              </label>
            </div>

            {/* UPI QR preview box if selected */}
            {paymentMethod === 'UPI QR Payment' && (
              <div className="mt-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-4 animate-in fade-in">
                <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center border border-stone-300 shadow-sm">
                  <QrCode className="w-16 h-16 text-black" />
                </div>
                <div className="text-xs text-stone-700">
                  <span className="font-bold text-black block mb-1">SG LEATHERS Official Factory UPI:</span>
                  <p className="font-mono font-bold text-black bg-white border border-stone-200 px-2 py-1 rounded inline-block">
                    9840225411@upi
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    You can complete payment now or share screenshot on WhatsApp after placing order.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Order Summary Review */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cart.length} items)</span>
              <span className="text-black font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Factory Shipping (Periamet to {city})</span>
              <span className={isFreeShipping ? 'text-emerald-700 font-bold' : 'text-black'}>
                {isFreeShipping ? 'FREE DELIVERY' : `₹${shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-black">
              <span>Grand Total</span>
              <span className="text-black text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98 transition-all"
            >
              <span>{isSubmitting ? 'Confirming Order...' : `Place Factory Order (₹${totalAmount.toLocaleString('en-IN')})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-stone-400 mt-2 font-medium">
              🔒 Encrypted 256-Bit Order Processing • SG LEATHERS Periamet Factory Hub
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
