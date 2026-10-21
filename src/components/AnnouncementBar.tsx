import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, MessageSquare } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export const AnnouncementBar: React.FC = () => {
  const { settings, setActiveCategory } = useShop();

  return (
    <div className="bg-stone-900 text-stone-100 text-xs py-2 px-4 transition-all border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{settings.announcementText}</span>
          <button
            onClick={() => setActiveCategory('flat-999-deals')}
            className="ml-2 font-bold text-amber-400 hover:text-white underline transition-colors cursor-pointer"
          >
            Shop ₹999 Deals →
          </button>
        </div>

        <div className="flex items-center gap-4 text-stone-300 shrink-0 text-[11px]">
          <span className="hidden lg:inline text-stone-400">📍 Periamet, Chennai • Mon-Sat 10AM-9PM | Sun 10AM-7PM</span>
          <button
            onClick={() => openWhatsApp(settings.retailWhatsApp1, "Hello SG Leathers, I'd like to check today's factory outlet collection.")}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp: {settings.retailWhatsApp1}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
