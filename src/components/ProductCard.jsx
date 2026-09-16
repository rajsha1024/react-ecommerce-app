import React from 'react';

// Receiving data via Props
export default function ProductCard({ title, price, image, category, rating, inStock, onAddToCart }) {

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      
      {/* Conditional Rendering for Out of Stock Tag */}
      {!inStock && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
          <span className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
            Out of Stock
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="group relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center p-4">
        <img 
          src={image} 
          alt={title} 
          className="h-full object-contain transition-transform duration-300 group-hover:scale-105" 
        />
        <span className="absolute top-2 left-2 rounded-full bg-slate-900/10 backdrop-blur-md px-2.5 py-0.5 text-xs font-medium text-slate-800 capitalize">
          {category}
        </span>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-700 min-h-[40px]">
          {title}
        </h3>
        
        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <span className="text-sm font-semibold text-amber-500">★</span>
          <span className="text-xs text-slate-500">{rating} / 5.0</span>
        </div>

        {/* Price & Action Button */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">${price}</span>
          <button
            onClick={onAddToCart}
            disabled={!inStock}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold tracking-wide shadow-sm transition-colors
              ${inStock 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
