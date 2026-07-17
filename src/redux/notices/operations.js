import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotices = createAsyncThunk(
  'notices/fetchAll',
  async (filters, thunkAPI) => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== undefined && value !== ''
        )
      );

      const { data } = await axios.get('/notices', {
        params,
      });

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch notices'
      );
    }
  }
);