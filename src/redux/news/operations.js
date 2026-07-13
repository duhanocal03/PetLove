import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Haberleri getiren Thunk operasyonu (Arama ve sayfalama destekli)
export const fetchNews = createAsyncThunk(
  'news/fetchAll',
  async ({ search = '', page = 1, limit = 6 } = {}, thunkAPI) => {
    try {
      // Örn: /news?keyword=dog&page=1&limit=6
      const response = await axios.get('/news', {
        params: {
          keyword: search,
          page,
          limit,
        },
      });
      return response.data; // Backend'in döndüğü haber dizisi ve sayfa bilgileri
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);