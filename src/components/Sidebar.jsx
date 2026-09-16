import React from 'react';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop overlay (Conditional Rendering based on state toggle) */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden 
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Content Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 border-r border-slate-200 bg-white p-6 transition-transform lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <h2 className="text-lg font-bold text-slate-800">Filters</h2>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-slate-100 text-slate-500">
            ✕
          </button>
        </div>

        <h2 className="hidden lg:block text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Filters</h2>

        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Categories</h3>
          <div className="space-y-2">
            {['Electronics', 'Jewelry', "Men's Clothing", "Women's Clothing"].map((category) => (
              <label key={category} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300" />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Price Sorting Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Sort By</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
              <input type="radio" name="sort" className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300" />
              Price: Low to High
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
              <input type="radio" name="sort" className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-slate-300" />
              Price: High to Low
            </label>
          </div>
        </div>
      </aside>
    </>
  );
}
