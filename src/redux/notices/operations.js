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

/*
 * POST @ /notices/favorites/add/{id}
 */
export const addFavorite = createAsyncThunk(
  'notice/addFavorite',
  async (id, thunkAPI) => {
    try {
      const res = await axios.post(`/notices/favorites/add/${id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/*
 * DELETE @ /notices/favorites/remove/{id}
 */
export const removeFavorite = createAsyncThunk(
  'notice/removeFavorite',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/notices/favorites/remove/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

/*
 * GET @ /notices/favorites
 */
export const fetchFavorites = createAsyncThunk(
  'notice/fetchFavorites',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/notices/favorites');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);