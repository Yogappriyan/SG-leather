import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES_LIST } from '../data/initialProducts';
import { 
  Search, 
  X, 
  ShoppingBag,
  Heart,
  ArrowUpDown
} from 'lucide-react';

interface ShopCatalogProps {
  onShowroomClick: () => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({ onShowroomClick }) => {
  const { 
    products, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    wishlist 
  } = useShop();

  const [selectedLeather, setSelectedLeather] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyFlat999, setOnlyFlat999] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');

  // Available Sizes
  const sizeOptions = ['6', '7', '8', '9', '10', '11'];
  const leatherTypes = [
    'Full Grain Leather',
    'Top Grain Leather',
    'Saddle Pull-Up Leather',
    'Burnished Calfskin',
    'Suede / Nubuck',
    'Nappa Soft Leather'
  ];

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (activeCategory === 'wishlist') {
        if (!wishlist.includes(product.id)) return false;
      } else if (activeCategory === 'flat-999-deals') {
        if (!product.isFlat999 && product.salePrice > 999) return false;
      } else if (activeCategory !== 'all') {
        if (product.category !== activeCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesMaterial = product.material.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesMaterial && !matchesCategory) return false;
      }

      // Leather Type filter
      if (selectedLeather !== 'all' && product.material !== selectedLeather) {
        return false;
      }

      // Size filter
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // In-stock filter
      if (onlyInStock) {
        const totalStock = Object.values(product.sizeStock || {}).reduce((a, b) => a + b, 0);
        if (totalStock <= 0) return false;
      }

      // Flat ₹999 filter
      if (onlyFlat999 && !product.isFlat999 && product.salePrice > 999) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.salePrice - b.salePrice;
      if (sortBy === 'price-desc') return b.salePrice - a.salePrice;
      if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      return 0; // featured default
    });
  }, [products, activeCategory, searchQuery, selectedLeather, selectedSize, onlyInStock, onlyFlat999, sortBy, wishlist]);

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedLeather('all');
    setSelectedSize('all');
    setOnlyInStock(false);
    setOnlyFlat999(false);
    setSortBy('featured');
  };

  return (
    <section className="py-6 sm:py-10 bg-white min-h-screen text-stone-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-black">
                SG LEATHERS FACTORY CATALOG
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-[10px] sm:text-xs text-stone-500 font-semibold">{filteredProducts.length} items</span>
            </div>
            <h1 className="font-brand text-2xl sm:text-4xl font-black text-black mt-1 capitalize leading-tight">
              {activeCategory === 'wishlist' 
                ? 'Your Saved Wishlist' 
                : activeCategory === 'flat-999-deals'
                  ? 'Famous ₹999 Clearance Deals'
                  : activeCategory === 'all'
                    ? 'All Leather Footwear & Goods'
                    : activeCategory.replace('-', ' ')}
            </h1>
          </div>

          {/* Search bar inside Catalog */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search leather style, boots, oxford..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-black rounded-xl pl-9 pr-8 py-2 text-xs text-black placeholder-stone-400 focus:outline-none shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 mb-4 sm:mb-6 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              activeCategory === 'all' 
                ? 'bg-black text-white shadow-sm' 
                : 'bg-stone-100 text-stone-700 hover:text-black hover:bg-stone-200'
            }`}
          >
            All Footwear & Goods
          </button>

          <button
            onClick={() => setActiveCategory('flat-999-deals')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1 ${
              activeCategory === 'flat-999-deals' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            <span>🔥 Famous ₹999 Deals</span>
          </button>

          {CATEGORIES_LIST.filter(c => c.id !== 'flat-999-deals').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                  ? 'bg-black text-white shadow-sm' 
                  : 'bg-stone-100 text-stone-700 hover:text-black hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {wishlist.length > 0 && (
            <button
              onClick={() => setActiveCategory('wishlist')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === 'wishlist' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'bg-stone-100 text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Wishlist ({wishlist.length})</span>
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 mb-4 sm:mb-8 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shadow-sm">
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            {/* Filter by Size */}
            <div className="flex items-center gap-1">
              <span className="text-stone-500 font-bold text-[11px] sm:text-xs">Size:</span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-white border border-stone-300 text-black rounded-lg px-2 py-1 text-[11px] sm:text-xs font-semibold focus:outline-none focus:border-black"
              >
                <option value="all">All Sizes</option>
                {sizeOptions.map(s => <option key={s} value={s}>UK {s}</option>)}
              </select>
            </div>

            {/* Filter by Leather Material */}
            <div className="flex items-center gap-1">
              <span className="text-stone-500 font-bold text-[11px] sm:text-xs">Leather:</span>
              <select
                value={selectedLeather}
                onChange={(e) => setSelectedLeather(e.target.value)}
                className="bg-white border border-stone-300 text-black rounded-lg px-2 py-1 text-[11px] sm:text-xs font-semibold focus:outline-none focus:border-black max-w-[130px] sm:max-w-none"
              >
                <option value="all">All Genuine Leathers</option>
                {leatherTypes.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* In stock toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 font-medium text-[11px] sm:text-xs">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-black focus:ring-0"
              />
              <span>In Stock</span>
            </label>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            <span className="text-stone-500 font-bold flex items-center gap-1 text-[11px] sm:text-xs">
              <ArrowUpDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 text-black rounded-lg px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-bold focus:outline-none focus:border-black"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>

            {(selectedLeather !== 'all' || selectedSize !== 'all' || onlyInStock || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] sm:text-[11px] text-black hover:underline font-bold ml-1 sm:ml-2"
              >
                Reset
              </button>
            )}
          </div>

        </div>

        {/* Product Cards Grid: 2 columns on mobile view */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-brand text-lg sm:text-xl font-black text-black">No Matching Genuine Leather Goods Found</h3>
            <p className="text-xs text-stone-500 max-w-sm">
              Try adjusting your category, size, or material filters to explore more of our factory collection.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2 rounded-xl bg-black hover:bg-stone-800 text-white font-black text-xs transition-colors"
            >
              Show All Factory Goods
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
