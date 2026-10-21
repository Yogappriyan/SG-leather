import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Building2, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import { openWhatsApp, generateWholesaleMessage } from '../utils/whatsapp';

export const StoreShowroom: React.FC = () => {
  const { settings } = useShop();

  const handleOpenGoogleMaps = () => {
    // Vepery High Road, Periamet, Chennai - 600003 near Indian Overseas Bank
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=SG+Leathers+Vepery+High+Road+Periamet+Chennai+600003`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-10 sm:py-24 bg-white border-b border-stone-200 relative overflow-hidden bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-black text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>VISIT OUR CHENNAI FACTORY OUTLET</span>
          </div>
          <h2 className="font-brand text-2xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
            SG LEATHERS SHOWROOM
          </h2>
          <p className="text-xs sm:text-base text-stone-600 mt-2 font-normal leading-relaxed">
            Experience our physical factory outlet in Periamet—India’s renowned leather capital. Try on handcrafted formal shoes, slip into driving loafers, inspect genuine cowhide and lambskin leather jackets, or browse our famous ₹999 factory clearance racks in person.
          </p>
        </div>

        {/* Showroom Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
          
          {/* Left: Showroom Address & Timings Card */}
          <div className="lg:col-span-6 bg-stone-50 border border-stone-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col justify-between shadow-md">
            
            <div className="space-y-6">
              
              {/* Address Block */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-stone-500 block mb-1">
                    Store Location & Landmark
                  </span>
                  <h3 className="font-brand text-lg font-black text-black leading-snug">
                    2nd Floor, Old No. 133 / New No. 40, Vepery High Road, Periamet, Chennai - 600003
                  </h3>
                  <p className="text-xs text-black font-extrabold mt-1">
                    📍 Situated near Indian Overseas Bank (IOB), Periamet
                  </p>
                  <p className="text-xs text-stone-600 mt-2">
                    Conveniently accessible from Chennai Central Railway Station (under 5 mins) and Periamet Leather Market.
                  </p>
                </div>
              </div>

              {/* Operating Hours Block */}
              <div className="flex items-start gap-4 pt-6 border-t border-stone-200">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-stone-500 block mb-1">
                    Operating Hours
                  </span>
                  <div className="space-y-1 text-xs">
                    <p className="text-stone-900 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>Monday to Saturday:</span>
                      <strong className="text-black">10:00 AM – 9:00 PM</strong>
                    </p>
                    <p className="text-stone-900 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-black" />
                      <span>Sunday:</span>
                      <strong className="text-black">10:00 AM – 7:00 PM</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Contact Lines */}
              <div className="flex items-start gap-4 pt-6 border-t border-stone-200">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 block">
                    Direct Contact & WhatsApp Lines
                  </span>
                  <div className="text-xs space-y-1.5 text-stone-700">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-stone-500 font-medium">Retail & Online Orders:</span>
                      <button
                        onClick={() => openWhatsApp(settings.retailWhatsApp1, "Hello SG Leathers, I would like to enquire about visiting your Periamet store.")}
                        className="text-black font-extrabold hover:underline"
                      >
                        {settings.retailWhatsApp1}
                      </button>
                      <span className="text-stone-400">/</span>
                      <button
                        onClick={() => openWhatsApp(settings.retailWhatsApp2, "Hello SG Leathers, checking store availability.")}
                        className="text-black font-extrabold hover:underline"
                      >
                        {settings.retailWhatsApp2}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-stone-500 font-medium">Wholesale & Bulk Enquiries:</span>
                      <button
                        onClick={() => openWhatsApp(settings.wholesaleWhatsApp, generateWholesaleMessage())}
                        className="text-black font-extrabold hover:underline"
                      >
                        {settings.wholesaleWhatsApp}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Direction & Action Buttons */}
            <div className="pt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenGoogleMaps}
                className="flex-1 py-3.5 px-4 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions (Google Maps)</span>
              </button>

              <button
                onClick={() => openWhatsApp(settings.retailWhatsApp1, "Hello SG Leathers, I am on my way to your Periamet outlet and need directions.")}
                className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Live Location</span>
              </button>
            </div>

          </div>

          {/* Right: Showroom Experience Visual Card */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-stone-200 shadow-md flex flex-col justify-end p-6 sm:p-10 min-h-[440px]">
            {/* High-res Workshop & Leather Showroom Image */}
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
              alt="SG Leathers Periamet Footwear Workshop"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.55]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-black text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Direct-From-Factory Advantage</span>
              </div>

              <h3 className="font-brand text-2xl sm:text-3xl font-black text-white">
                THE PERIAMET LEATHER EXPERIENCE
              </h3>

              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-lg font-light">
                Periamet in Chennai has served as India's premier leather processing and finished goods hub for over a century. At <strong className="text-white font-bold">SG LEATHERS</strong>, every shoe, bag, and jacket is crafted and offered directly from our manufacturing partner lines to ensure unmatched affordability.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-white font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom In-Store Sizing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Factory Clearance Racks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Size Exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Wholesale Sample Viewing</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
