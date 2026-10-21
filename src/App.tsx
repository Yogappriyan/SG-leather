import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FloatingShowcase } from './components/FloatingShowcase';
import { Flat999Deals } from './components/Flat999Deals';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { ShopCatalog } from './components/ShopCatalog';
import { StoreShowroom } from './components/StoreShowroom';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ToastContainer } from './components/ToastContainer';
import { Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { openWhatsApp } from './utils/whatsapp';

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'showroom' | 'about'>('home');
  const { products, setActiveCategory, settings } = useShop();

  const featuredProducts = products.filter(p => p.featured && !p.isFlat999);

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Sticky Header with Sliding Drawer & Official Logo */}
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      {/* Dynamic Views */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-0">
            {/* Hero Section with 3D Tilt & Floating Footwear */}
            <Hero 
              onExplore={(cat) => {
                if (cat) setActiveCategory(cat);
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowroom={() => {
                setCurrentView('showroom');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Famous Flat ₹999 Clearance Deals Section */}
            <Flat999Deals 
              onViewAllDeals={() => {
                setActiveCategory('flat-999-deals');
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Interactive Floating Product Showcase */}
            <FloatingShowcase />

            {/* Shop by Leather Category Grid */}
            <CategoryGrid 
              onSelectCategory={(categoryId) => {
                setActiveCategory(categoryId);
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Featured Footwear & Bags Grid */}
            <section className="py-16 bg-stone-50/50 border-b border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-black text-xs font-black uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>FACTORY SELECTION</span>
                    </div>
                    <h2 className="font-brand text-3xl sm:text-4xl font-black text-black">
                      FEATURED GENUINE LEATHER GOODS
                    </h2>
                    <p className="text-sm text-stone-600 mt-1 max-w-xl">
                      Mastercrafted Oxford shoes, rugged pull-up Chelsea boots, and executive laptop briefcases straight from our Periamet tannery partner lines.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-stone-800 text-white text-xs font-black transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    <span>View All Footwear & Goods</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

              </div>
            </section>

            {/* Periamet Showroom Teaser & Experience */}
            <StoreShowroom />

            {/* Quick WhatsApp Inquiry Strip */}
            <section className="py-14 bg-stone-100 border-y border-stone-200 text-center">
              <div className="max-w-4xl mx-auto px-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 border border-stone-200 flex items-center justify-center mx-auto shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-brand text-2xl sm:text-3xl font-black text-black">
                  NEED SIZING HELP OR LIVE FACTORY PHOTOS?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-normal">
                  Our Periamet showroom team is available on WhatsApp daily. Share the styles you like, get real video clips, or order with instant home delivery.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => openWhatsApp(settings.retailWhatsApp1, "Hello SG Leathers, I would like to see live photos and sizing advice for shoes.")}
                    className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp {settings.retailWhatsApp1}</span>
                  </button>

                  <button
                    onClick={() => openWhatsApp(settings.retailWhatsApp2, "Hello SG Leathers, checking product options.")}
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-black border border-stone-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Alt WhatsApp {settings.retailWhatsApp2}</span>
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

        {currentView === 'shop' && (
          <ShopCatalog 
            onShowroomClick={() => {
              setCurrentView('showroom');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'showroom' && (
          <StoreShowroom />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <OrderTrackerModal />
      <AdminDashboard />
      <ToastContainer />

      {/* Footer with accurate SG Leathers details */}
      <Footer 
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentView('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
