import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { authReducer } from './slice';
import { newsReducer } from '../news/slice';
import { noticesReducer } from '../notices/slice'; // 👈 1. Adım: noticesReducer'ı içeri aktardık

// Vite ortamında import hatalarını önlemek için tarayıcı API'sini doğrudan sarmallıyoruz
const customLocalStorage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const authPersistConfig = {
  key: 'auth',
  storage: customLocalStorage,
  whitelist: ['token'], // Sadece token alanını localStorage'a yazıyoruz
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    news: newsReducer, 
    notices: noticesReducer, // 👈 2. Adım: Reducer'ı buraya ekledik (Persist etmeye gerek yok, state'te uçucu kalması yeterli)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);