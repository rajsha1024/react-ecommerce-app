import { createSlice } from '@reduxjs/toolkit';

const readWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem('shopx-wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const persistWishlist = (items) => {
  localStorage.setItem('shopx-wishlist', JSON.stringify(items));
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: readWishlistFromStorage(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.wishlistItems.some((item) => item.id === action.payload.id);

      if (!exists) {
        state.wishlistItems.push({ ...action.payload });
        persistWishlist(state.wishlistItems);
      }
    },

    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter((item) => item.id !== action.payload);
      persistWishlist(state.wishlistItems);
    },

    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem('shopx-wishlist');
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;