import { createSlice } from '@reduxjs/toolkit';
import { fetchNotices } from './operations';

const initialState = {
  items: [],
  totalPages: 1,
  totalItems: 0,
  isLoading: false,
  error: null,
};

const noticesSlice = createSlice({
  name: 'notices',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.isLoading = false;

        const data = action.payload;

        state.items =
          data.results ||
          data.items ||
          data.notices ||
          data ||
          [];

        state.totalPages =
          data.totalPages ||
          data.totalPagesCount ||
          1;

        state.totalItems =
          data.totalItems ||
          data.total ||
          0;
      })

      .addCase(fetchNotices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.items = [];
      });
  },
});

export const noticesReducer = noticesSlice.reducer;