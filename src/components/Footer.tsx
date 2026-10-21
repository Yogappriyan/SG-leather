import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Lock, 
  PackageCheck
} from 'lucide-react';
import { openWhatsApp, generateWholesaleMessage } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (view: 'home' | 'shop' | 'showroom') => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const { settings, setIsAdminOpen, setIsOrderTrackingOpen } = useShop();

  return (
    <footer className="bg-stone-50 border-t border-stone-200 text-stone-600 text-xs">
      
      {/* Top Banner Feature */}
      <div className="border-b border-stone-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-black flex items-center justify-center shrink-0 border border-stone-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-black block">100% Genuine Leather Guarantee</span>
              <span className="text-[11px] text-stone-500">Zero synthetic or faux rexine substitutes.</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-black flex items-center justify-center shrink-0 border border-stone-200">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-black block">Periamet Factory Outlet, Chennai</span>
              <span className="text-[11px] text-stone-500">Direct factory pricing with no middleman markup.</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-black block">Instant WhatsApp Support</span>
              <span className="text-[11px] text-stone-500">Photos, sizing & orders via +91 9840225411.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand Info with User Logo Image */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/aistudio/image_67be200c.png" 
                alt="SG LEATHERS Logo"
                className="w-10 h-10 rounded-full object-cover border border-stone-300 shadow-sm"
              />
              <span className="font-brand text-2xl font-black text-black tracking-tight">
                SG LEATHERS
              </span>
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              <strong>SG LEATHERS</strong> is a long-standing genuine leather factory outlet in Periamet, Chennai. Renowned for budget-friendly direct-from-factory pricing—including famous flat-rate <span className="text-black font-black underline">₹999 deals</span>—the store offers an extensive inventory of authentic leather goods ranging from formal shoes, loafers, and boots to office laptop bags, travel duffels, jackets, belts, and wallets.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => openWhatsApp(settings.retailWhatsApp1, "Hello SG Leathers, I am contacting you from the website.")}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </button>

              <button
                onClick={() => setIsOrderTrackingOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-black font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <PackageCheck className="w-3.5 h-3.5 text-black" />
                <span>Track Order</span>
              </button>
            </div>
          </div>

          {/* Col 2: Leather Collections */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-brand text-xs font-black uppercase tracking-wider text-black">
              Collections
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button 
                  onClick={() => { onNavigate('shop'); onSelectCategory('flat-999-deals'); }}
                  className="hover:text-red-600 text-red-600 font-black transition-colors cursor-pointer"
                >
                  🔥 Famous ₹999 Deals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('shop'); onSelectCategory('formal-shoes'); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Formal Oxford & Derby
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('shop'); onSelectCategory('loafers'); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Loafers & Moccasins
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('shop'); onSelectCategory('boots'); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Chelsea & Lace-Up Boots
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('shop'); onSelectCategory('laptop-bags'); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Executive Laptop Bags
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('shop'); onSelectCategory('jackets'); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Pure Leather Jackets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { onNavigate('shop'); onSelectCategory('wallets'); }}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Wallets & Belts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Outlet Location & Timings */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-brand text-xs font-black uppercase tracking-wider text-black">
              Factory Showroom
            </h4>
            <div className="space-y-2 text-stone-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <p className="leading-snug">
                  2nd Floor, Old No. 133 / New No. 40, Vepery High Road, Periamet, Chennai - 600003
                  <span className="block text-black text-[11px] font-black mt-0.5">
                    (Near Indian Overseas Bank)
                  </span>
                </p>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <div>
                  <p className="text-black font-bold">Mon - Sat: 10:00 AM – 9:00 PM</p>
                  <p className="text-stone-700 font-semibold">Sunday: 10:00 AM – 7:00 PM</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('showroom')}
                className="text-black hover:underline font-black text-xs inline-flex items-center gap-1 pt-1"
              >
                <span>View Full Showroom Details & Map →</span>
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Wholesale */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-brand text-xs font-black uppercase tracking-wider text-black">
              Contact & Enquiries
            </h4>
            <div className="space-y-2 text-stone-700">
              <div>
                <span className="text-[11px] text-stone-500 font-bold block uppercase">Retail / Online Orders:</span>
                <div className="flex flex-col gap-1 mt-0.5">
                  <button 
                    onClick={() => openWhatsApp(settings.retailWhatsApp1, "Hello SG Leathers")}
                    className="text-black hover:underline font-extrabold text-left"
                  >
                    {settings.retailWhatsApp1}
                  </button>
                  <button 
                    onClick={() => openWhatsApp(settings.retailWhatsApp2, "Hello SG Leathers")}
                    className="text-black hover:underline font-extrabold text-left"
                  >
                    {settings.retailWhatsApp2}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <span className="text-[11px] text-stone-500 font-bold block uppercase">Wholesale / Bulk Enquiries:</span>
                <button 
                  onClick={() => openWhatsApp(settings.wholesaleWhatsApp, generateWholesaleMessage())}
                  className="text-black font-extrabold hover:underline text-left mt-0.5"
                >
                  {settings.wholesaleWhatsApp}
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-stone-500 hover:text-black flex items-center gap-1 text-[11px] transition-colors font-semibold"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Inventory Portal</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Disclaimer */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} SG LEATHERS. All rights reserved. Genuine Leather Factory Outlet, Periamet, Chennai.</p>
          <p className="text-center sm:text-right">
            Handcrafted with authentic full-grain hides • Direct-from-factory pricing • Flat ₹999 deals
          </p>
        </div>

      </div>

    </footer>
  );
};
