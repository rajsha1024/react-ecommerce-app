import { createSlice } from '@reduxjs/toolkit';

const savedAuth = localStorage.getItem('shopx-auth');

const initialState = savedAuth
  ? JSON.parse(savedAuth)
  : {
      token: null,
      user: null,
    };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem(
        'shopx-auth',
        JSON.stringify({
          token: state.token,
          user: state.user,
        })
      );
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('shopx-auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;