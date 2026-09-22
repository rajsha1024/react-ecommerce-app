// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import wishlistReducer from './wishlistSlice';
export const store = configureStore({
  reducer: {
    cart: cartReducer, // register the cart reducer
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});
