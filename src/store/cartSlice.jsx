import { createSlice } from "@reduxjs/toolkit";
const cartSlice = createSlice({
    name: 'cart',
    initialState: { cartItems: [] },
    reducers: {
      addToCart: (state, action) => {
        const existingItem = state.cartItems.find(item => item.id === action.payload.id);
        if (existingItem) { existingItem.quantity += 1; } 
        else { state.cartItems.push({ ...action.payload, quantity: 1 }); }
      },
      // increase quantity value
      incrementQuantity: (state, action) => {
        const item = state.cartItems.find(item => item.id === action.payload);
        if (item) item.quantity += 1;
      },
      // decrease quantity
      decrementQuantity: (state, action) => {
        const item = state.cartItems.find(item => item.id === action.payload);
        if (item) {
            //  If quantity is only 1 and user clicks minus, REMOVE the product from the cart
          if (item.quantity === 1) {
            state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
          } else {
            item.quantity -= 1;
          }
        }
      },
      //
      clearCart: (state) => {
        state.cartItems = [];
      }
    }
  });
export const { addToCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;