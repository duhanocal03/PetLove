import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Haberleri getiren Thunk operasyonu 
export const fetchNews = createAsyncThunk(
  'news/fetchAll',
  async ({ search = '', page = 1, limit = 6 } = {}, thunkAPI) => {
    try {
      const response = await axios.get('/news', {
        params: {
          keyword: search,
          page,
          limit,
        },
      });
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);