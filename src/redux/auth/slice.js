import { createSlice } from '@reduxjs/toolkit';
import { register, logIn, logOut, refreshUser } from './operations';

const initialState = {
  user: { name: null, email: null },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.fulfilled, (state, action) => {
        // Backend'den gelen veri yapısına göre action.payload veya action.payload.data kontrolü
        state.user = action.payload?.user || { name: null, email: null };
        state.token = action.payload?.token || null;
        state.isLoggedIn = !!action.payload?.token; // Token varsa true yap
      })
      // LOGIN
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = action.payload?.user || { name: null, email: null };
        state.token = action.payload?.token || null;
        state.isLoggedIn = !!action.payload?.token;
      })
      // LOGOUT
      .addCase(logOut.fulfilled, (state) => {
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
      })
      // REFRESH USER
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        // Swagger current user isteğinde nesneyi sarmalamadan direkt user objesini dönebilir
        state.user = action.payload?.user || action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isRefreshing = false;
        state.token = null; // Token geçersizse temizlemesi faydalı olur
      });
  },
});

export const authReducer = authSlice.reducer;