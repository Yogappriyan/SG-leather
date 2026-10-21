import React from 'react';
import { CATEGORIES_LIST } from '../data/initialProducts';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-black text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>FACTORY COLLECTIONS</span>
          </div>
          <h2 className="font-brand text-3xl sm:text-4xl font-black text-black tracking-tight">
            SHOP BY LEATHER CATEGORY
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            From boardroom Oxford brogues to weekend travel duffels and pure lambskin biker jackets. Direct factory pricing on all categories.
          </p>
        </div>

        {/* Categories Grid (Images preserved exactly as requested) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_LIST.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative h-72 rounded-3xl overflow-hidden border border-stone-200 hover:border-black transition-all duration-500 cursor-pointer shadow-md hover:shadow-xl flex flex-col justify-end p-6"
            >
              {/* Background Image with Zoom on Hover */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${
                  cat.id === 'flat-999-deals'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-black'
                }`}>
                  {cat.badge}
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-brand text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-200 line-clamp-2 mt-1 font-light">
                    {cat.description}
                  </p>
                  <span className="text-[11px] font-bold text-amber-300 mt-2 block">
                    {cat.count} Available
                  </span>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-white group-hover:bg-black text-black group-hover:text-white border border-stone-200 flex items-center justify-center shrink-0 transition-all duration-300 shadow-md group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
