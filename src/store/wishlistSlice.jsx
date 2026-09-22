import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../services/api';

export const fetchWishlistItems = createAsyncThunk(
  'wishlist/fetchAll',
  async (userId, { rejectWithValue }) => {
    try {
      return await wishlistService.fetchAll(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlistDB = createAsyncThunk(
  'wishlist/add',
  async ({ userId, product }, { rejectWithValue }) => {
    try {
      return await wishlistService.add(userId, product);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlistDB = createAsyncThunk(
  'wishlist/remove',
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistService.remove(productId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetWishlistState: (state) => {
      state.wishlistItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Fetch Wishlist 
      .addCase(fetchWishlistItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlistItems = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlistDB.pending, (state, action) => {
        // action.meta.arg those data passed in dispatch(addToWishlistDB({ userId, product })) will be available here
        const { product } = action.meta.arg; 
        const exists = state.wishlistItems.some(item => item.id === product.id);
        
        if (!exists) {
          state.wishlistItems.push(product); // add in Ui before api response
        }
      })
      .addCase(addToWishlistDB.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToWishlistDB.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // roll back if api fails then remove the product that was optimistically added
        const { product } = action.meta.arg;
        state.wishlistItems = state.wishlistItems.filter(item => item.id !== product.id);
      })

      // 3. Remove from Wishlist:optimistic Update
      .addCase(removeFromWishlistDB.pending, (state, action) => {
        const productId = action.meta.arg; 
        
        // keep backup of current wishlist items in case we need to rollback
        state.previousWishlistItems = [...state.wishlistItems]; 
        state.wishlistItems = state.wishlistItems.filter(item => item.id !== productId);
      })
      .addCase(removeFromWishlistDB.fulfilled, (state) => {
        state.isLoading = false;
        delete state.previousWishlistItems; // delete the backup after successful removal
      })
      .addCase(removeFromWishlistDB.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // rollback if api fails
        if (state.previousWishlistItems) {
          state.wishlistItems = state.previousWishlistItems;
          delete state.previousWishlistItems;
        }
      });
  },
});

export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
