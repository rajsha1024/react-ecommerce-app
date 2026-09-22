import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';


export default function ProductDetailPage({ onBack }) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const { id: productId } = useParams();

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isWishlisted = product ? wishlistItems.some((item) => item.id === product.id) : false;



  // 1. Single Product Data Fetching API Request

  useEffect(() => {
    if (!productId) return;
    setIsLoading(true);
    setError(null);

    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then((res) => {

        if (!res.ok) throw new Error('Product not found or network error');
        return res.json();
      })
      .then((data) => {
        // Adding custom inStock status just like your HomePage array
        const formattedData = { ...data, inStock: true };

        setProduct(formattedData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  // 2. Action Handlers
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  // 3. Loading State (Skeleton Placeholder)
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
        <div className="mb-6 h-6 w-20 rounded bg-slate-200"></div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-xl bg-slate-200"></div>
          <div className="space-y-4">
            <div className="h-4 w-1/4 rounded bg-slate-200"></div>
            <div className="h-8 w-3/4 rounded bg-slate-200"></div>
            <div className="h-4 w-1/6 rounded bg-slate-200"></div>
            <div className="h-24 w-full rounded bg-slate-200"></div>
            <div className="h-10 w-1/3 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Error State Display
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700 inline-block max-w-md">
          <p className="font-semibold">Oops! Something went wrong.</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={onBack} 
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // 5. Success Active Component Rendering
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span> 
        Back to Products
      </button>

      {product && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Left: Product Image Area */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center p-6 border border-slate-100">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[400px] object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Right: Product Details Info Content */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category Tag */}
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 capitalize tracking-wide">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {product.title}
              </h1>

              {/* Rating Review Badges */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-lg font-semibold text-amber-500">★</span>
                <span className="text-sm font-medium text-slate-700">
                  {product.rating?.rate || 0} / 5.0
                </span>
                <span className="text-sm text-slate-400">
                  ({product.rating?.count || 0} customer reviews)
                </span>
              </div>

              {/* Divider */}
              <hr className="my-6 border-slate-200" />

              {/* Description Content Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Price & Primary Call To Action Panel */}
            <div className="mt-8 pt-6 border-t border-slate-100 sm:flex sm:items-center sm:justify-between gap-4">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm font-medium text-slate-400">Total Price</p>
                <p className="text-3xl font-extrabold text-slate-900">\${product.price}</p>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full sm:w-auto rounded-xl px-8 py-3.5 text-sm font-semibold tracking-wide shadow-sm transition-all text-center
                  ${product.inStock
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transform active:scale-[0.98]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
              >
                {product.inStock ? 'Add to Shopping Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
