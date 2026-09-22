import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {incrementQuantity, decrementQuantity} from '../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { removeFromWishlistDB } from '../store/wishlistSlice';

export default function Navbar({ onToggleSidebar, searchValue, onSearchChange }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Get cart data from Redux
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const wishlistCount = wishlistItems.length;


  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo & Toggle */}
          <div className="flex items-center gap-3">
            <button onClick={onToggleSidebar} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <Link to="/" className="text-xl font-black tracking-tight text-indigo-600">
              ShopX
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden max-w-md flex-1 sm:block">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-1.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white"
              value={searchValue}
              onChange={onSearchChange}
              />
          </div>

          <div>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  dispatch(logout());
                  navigate('/');
                }}
                className="mr-2 text-xs cursor-pointer font-semibold text-slate-600 hover:text-indigo-600"
              >
                Logout <span> {user && user.username ? user.username : ""}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="mr-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Login
              </button>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsWishlistOpen(!isWishlistOpen)}
              className="group relative rounded-full p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Wishlist"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={wishlistCount > 0 ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                strokeWidth="1.8" 
                className="h-6 w-6 group-hover:text-red-500 transition-colors"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>


              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {isWishlistOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-black/5 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">Wishlist ({wishlistCount})</h3>
                  <button
                    type="button"
                    onClick={() => setIsWishlistOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕ Close
                  </button>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">No saved items yet</div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 border-b border-slate-50 pb-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-12 w-12 object-contain rounded-md border border-slate-100 p-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-slate-700 truncate">{item.title}</h4>
                          <p className="mt-0.5 text-xs font-bold text-slate-900">${item.price?.toFixed(2) || 0.00}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromWishlistDB(item.id))}
                          className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.title} from wishlist`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon Area with Dropdown Container */}
          <div className="relative">
            {/* Cart Trigger Button */}
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)} 
              className="group relative rounded-full p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Live Cart Dropdown Overlay (Conditional Rendering) */}
            {isCartOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-black/5 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">My Cart ({cartCount})</h3>
                  <button onClick={() => setIsCartOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">✕ Close</button>
                </div>

                {/* Empty State */}
                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">
                     Cart is empty
                  </div>
                ) : (
                  <>
                    {/* Item List Container with scroll */}
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 border-b border-slate-50 pb-2">
                          <img src={item.image} alt={item.title} className="h-12 w-12 object-contain rounded-md border border-slate-100 p-0.5" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-slate-700 truncate">{item.title}</h4>
                            <p className="text-xs font-bold text-slate-900 mt-0.5">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          
                          {/* Quantity Toggles (+ / -) */}
                          <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-1 py-0.5 bg-slate-50">
                            <button onClick={() => dispatch(decrementQuantity(item.id))} className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-1">-</button>
                            <span className="text-xs font-semibold text-slate-700">{item.quantity}</span>
                            <button onClick={() => dispatch(incrementQuantity(item.id))} className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-1">+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Calculation Bill Summary & Checkout */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-sm font-bold text-slate-900 mb-3">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <button onClick={() => {
                          setIsCartOpen(false);
                          navigate('/checkout');
                        }} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-xs transition-colors shadow-sm">
                        Checkout Now
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
