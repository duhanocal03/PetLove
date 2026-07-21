import { createSlice } from '@reduxjs/toolkit';
import { fetchNews } from './operations';

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    items: [],
    totalPages: 1,
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload?.results || action.payload || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const newsReducer = newsSlice.reducer;