import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

//  PetLove Swagger Base URL'i
axios.defaults.baseURL = 'https://petlove.b.goit.study/api';

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk('auth/register', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post('/users/signup', credentials);
    setAuthHeader(res.data.token);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logIn = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await axios.post('/users/signin', credentials);
    setAuthHeader(res.data.token);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post('/users/signout');
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const refreshUser = createAsyncThunk('auth/refresh', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.token;

  if (!persistedToken) {
    return thunkAPI.rejectWithValue('No token found');
  }

  try {
    setAuthHeader(persistedToken);
    const res = await axios.get('/users/current');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async (userData, thunkAPI) => {
  try {
    const response = await axios.patch('/users/current/edit', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const addMyPet = createAsyncThunk('auth/addMyPet', async (petData, thunkAPI) => {
  try {
    const response = await axios.post('/users/current/pets/add', petData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchSpecies = createAsyncThunk('auth/fetchSpecies', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/notices/species');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteMyPet = createAsyncThunk('auth/deleteMyPet', async (petId, thunkAPI) => {
  try {
    const { data } = await axios.delete(`/users/current/pets/remove/${petId}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});