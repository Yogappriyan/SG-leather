import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Lock, 
  Clock, 
  MapPin, 
  PackageCheck,
  User
} from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'shop' | 'showroom' | 'about';
  setCurrentView: (view: 'home' | 'shop' | 'showroom' | 'about') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    activeCategory, 
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsAdminOpen,
    setIsOrderTrackingOpen
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', view: 'home', category: 'all' },
    { label: 'SHOP', view: 'shop', category: 'all' },
    { label: 'MEN', view: 'shop', category: 'formal-shoes' },
    { label: 'CASUAL', view: 'shop', category: 'loafers' },
    { label: 'BOOTS', view: 'shop', category: 'boots' },
    { label: 'BAGS', view: 'shop', category: 'laptop-bags' },
    { 
      label: 'NEW ARRIVALS', 
      view: 'shop', 
      category: 'all',
      badge: 'NEW'
    },
    { 
      label: 'OFFERS', 
      view: 'shop', 
      category: 'flat-999-deals',
      badge: 'DEALS',
      highlight: true 
    },
    { label: 'CONTACT', view: 'showroom', category: 'all' },
  ];

  const handleNavClick = (view: 'home' | 'shop' | 'showroom' | 'about', cat: string) => {
    setCurrentView(view);
    setActiveCategory(cat);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-40 transition-all duration-200 bg-white border-b border-stone-200 ${
          isScrolled 
            ? 'shadow-md py-2.5' 
            : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-stone-800 hover:text-black hover:bg-stone-100 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo with User's Uploaded Logo Image */}
            <div 
              onClick={() => handleNavClick('home', 'all')}
              className="cursor-pointer flex items-center gap-3 group select-none shrink-0"
            >
              {/* Logo Image requested: /assets/aistudio/image_67be200c.png */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-stone-300 shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform">
                <img 
                  src="/assets/aistudio/image_67be200c.png" 
                  alt="SG LEATHERS Official Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-brand text-xl sm:text-2xl font-black tracking-tight text-black leading-none">
                    SG LEATHERS
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] tracking-wider text-stone-500 font-bold uppercase mt-0.5">
                  Factory Outlet • Periamet
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links matching the reference image layout */}
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              {navItems.map((item) => {
                const isActive = (currentView === item.view && (item.category === 'all' || activeCategory === item.category));
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.view as any, item.category)}
                    className={`relative py-1 text-xs xl:text-[13px] font-extrabold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? 'text-black font-black' 
                        : 'text-stone-600 hover:text-black'
                    }`}
                  >
                    <span>{item.label}</span>

                    {/* Pill badge matching reference image */}
                    {item.badge && (
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full leading-none tracking-tight ${
                        item.badge === 'DEALS' 
                          ? 'bg-black text-white' 
                          : 'bg-black text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Active Underline matching reference */}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-black rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons matching reference image */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-colors ${
                  isSearchOpen ? 'bg-stone-100 text-black' : 'text-stone-700 hover:text-black hover:bg-stone-100'
                }`}
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  setCurrentView('shop');
                  setActiveCategory('wishlist');
                }}
                className="relative p-2 rounded-full text-stone-700 hover:text-black hover:bg-stone-100 transition-colors"
                aria-label="View Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[2.2]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] font-black text-white flex items-center justify-center animate-scale-in">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Order Tracking / Account Icon */}
              <button
                onClick={() => setIsOrderTrackingOpen(true)}
                className="p-2 rounded-full text-stone-700 hover:text-black hover:bg-stone-100 transition-colors"
                title="Track your Order"
                aria-label="Track your Order"
              >
                <User className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Cart Button: Circular black icon with white bag as in reference */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black hover:bg-stone-800 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer ml-1"
                aria-label="View Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Button */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-black hover:bg-stone-100 transition-colors"
                title="Admin Dashboard"
                aria-label="Admin Dashboard"
              >
                <Lock className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Collapsible Search Bar */}
          {isSearchOpen && (
            <div className="pt-3 pb-1 animate-in slide-in-from-top-2">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search pure leather formal shoes, Chelsea boots, ₹999 loafers, laptop bags..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'shop') setCurrentView('shop');
                  }}
                  autoFocus
                  className="w-full bg-stone-50 border border-stone-300 focus:border-black rounded-xl pl-10 pr-10 py-2.5 text-sm text-stone-900 placeholder-stone-500 focus:outline-none shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sliding Mobile Navigation Menu (Drawer) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative ml-0 mr-auto w-full max-w-xs h-full bg-white border-r border-stone-200 flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-300 text-stone-900">
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/assets/aistudio/image_67be200c.png" 
                  alt="SG Leathers Logo"
                  className="w-9 h-9 rounded-full object-cover border border-stone-300"
                />
                <div>
                  <span className="font-brand text-lg font-black text-black">SG LEATHERS</span>
                  <p className="text-[10px] text-stone-500 font-semibold tracking-wider">Periamet Factory, Chennai</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-stone-500 hover:text-black hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Deal Banner */}
            <div className="p-3 bg-stone-100 border border-stone-200 m-3 rounded-xl">
              <span className="text-xs font-black text-black flex items-center gap-1">
                🔥 Flat ₹999 Clearance Deals Active
              </span>
              <p className="text-[11px] text-stone-600 mt-0.5">Direct-from-factory moccasins, loafers & combos.</p>
              <button
                onClick={() => handleNavClick('shop', 'flat-999-deals')}
                className="mt-2 text-xs font-bold text-black underline inline-flex items-center gap-1"
              >
                View ₹999 Deals →
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.view as any, item.category)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider flex items-center justify-between transition-colors ${
                    activeCategory === item.category && currentView === item.view
                      ? 'bg-black text-white'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-black'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      activeCategory === item.category && currentView === item.view
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-4 border-t border-stone-200 space-y-1">
                <button
                  onClick={() => {
                    setIsOrderTrackingOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-2.5"
                >
                  <PackageCheck className="w-4 h-4 text-black" />
                  <span>Track My Order</span>
                </button>

                <button
                  onClick={() => {
                    setIsAdminOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-100 flex items-center gap-2.5"
                >
                  <Lock className="w-4 h-4 text-stone-500" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer with Store Details */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 text-xs text-stone-600 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                <span>2nd Floor, Vepery High Rd, Periamet, Chennai - 600003</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Mon-Sat 10AM-9PM | Sun 10AM-7PM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
