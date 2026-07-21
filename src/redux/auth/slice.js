import { createSlice } from '@reduxjs/toolkit';
import { register, logIn, logOut, refreshUser, updateUser, addMyPet, deleteMyPet } from './operations';
import { addFavorite, removeFavorite } from '../notices/operations'; 

// localStorage'dan kayıtlı petleri güvenli bir şekilde oku
const loadInitialPets = () => {
  try {
    const savedPets = localStorage.getItem('savedUserPets');
    return savedPets ? JSON.parse(savedPets) : [];
  } catch {
    return [];
  }
};

const initialState = {
  user: {
    name: null,
    email: null,
    phone: null,
    avatar: localStorage.getItem('savedUserAvatar') || null, 
    noticesFavorites: [],
    pets: loadInitialPets(), 
  },
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
        state.user = action.payload?.user || { name: null, email: null, phone: null, avatar: null, pets: [] };
        state.token = action.payload?.token || null;
        state.isLoggedIn = !!action.payload?.token;
        localStorage.setItem('savedUserPets', JSON.stringify(state.user.pets || []));
      })
      // LOGIN
      .addCase(logIn.fulfilled, (state, action) => {
        const payloadUser = action.payload?.user || action.payload;
        const userPets = payloadUser?.pets || state.user?.pets || [];
        
        state.user = {
          ...state.user,
          ...payloadUser,
          avatar: payloadUser?.avatar || state.user?.avatar,
          pets: userPets
        };
        state.token = action.payload?.token || state.token;
        state.isLoggedIn = true;
        localStorage.setItem('savedUserPets', JSON.stringify(userPets));
      })
      // LOGOUT
      .addCase(logOut.fulfilled, (state) => {
        state.user = { name: null, email: null, phone: null, avatar: null, pets: [] };
        state.token = null;
        state.isLoggedIn = false;
        localStorage.removeItem('savedUserPets');
        localStorage.removeItem('savedUserAvatar');
      })
      // REFRESH USER
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        const payloadUser = action.payload?.user || action.payload;
        if (payloadUser) {
          const avatarUrl = payloadUser.avatar || localStorage.getItem('savedUserAvatar') || null;
          if (payloadUser.avatar) {
            localStorage.setItem('savedUserAvatar', payloadUser.avatar);
          }
          
          const updatedPets = payloadUser.pets || state.user.pets || [];
          localStorage.setItem('savedUserPets', JSON.stringify(updatedPets));

          state.user = {
            ...state.user,
            ...payloadUser,
            avatar: avatarUrl,
            pets: updatedPets,
          };
        }
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isRefreshing = false;
        state.token = null;
      })
      
      // ADD MY PET 
      .addCase(addMyPet.fulfilled, (state, action) => {
        if (!state.user.pets) state.user.pets = [];
        
        const responseData = action.payload;

        // Eğer backend tüm user objesini veya güncel pets listesini döndüyse:
        if (responseData && responseData.pets && Array.isArray(responseData.pets)) {
          state.user.pets = responseData.pets;
        } 
        // Eğer backend sadece yeni eklenen pet objesini döndüyse (ve içinde email vb. user verisi yoksa):
        else if (responseData && (responseData._id || responseData.id) && !responseData.email) {
          state.user.pets.push(responseData);
        }
        
        localStorage.setItem('savedUserPets', JSON.stringify(state.user.pets));
      })

      // DELETE MY PET (GÜNCELLENDİ: action.meta.arg ile ID'yi %100 doğru yakalıyoruz)
      .addCase(deleteMyPet.fulfilled, (state, action) => {
        if (state.user && state.user.pets) {
          const deletedPetId = action.meta.arg; 

          state.user.pets = state.user.pets.filter(
            (pet) => String(pet._id || pet.id) !== String(deletedPetId)
          );

          localStorage.setItem('savedUserPets', JSON.stringify(state.user.pets));
        }
      })
      // UPDATE USER
      .addCase(updateUser.fulfilled, (state, action) => {
        const payloadUser = action.payload?.user || action.payload;
        if (payloadUser) {
          const avatarUrl = payloadUser.avatar || localStorage.getItem('savedUserAvatar') || null;
          if (payloadUser.avatar) {
            localStorage.setItem('savedUserAvatar', payloadUser.avatar);
          }
          state.user = {
            ...state.user,
            ...payloadUser,
            avatar: avatarUrl,
          };
        }
      })
      // ADD FAVORITE
      .addCase(addFavorite.fulfilled, (state, action) => {
        const newFavorite = 
          action.payload?.notice || action.payload?.data || action.payload?.result || action.payload;
        
        if (state.user) {
          if (!state.user.noticesFavorites) state.user.noticesFavorites = [];

          if (Array.isArray(action.payload)) {
            state.user.noticesFavorites = action.payload;
          } else if (Array.isArray(action.payload?.noticesFavorites)) {
            state.user.noticesFavorites = action.payload.noticesFavorites;
          } else if (newFavorite) {
            const favoriteId = newFavorite._id || newFavorite.id || newFavorite;
            const exists = state.user.noticesFavorites.some(
              (item) => String(item?._id || item?.id || item) === String(favoriteId)
            );

            if (!exists) {
              state.user.noticesFavorites.push(newFavorite);
            }
          }
        }
      })
      // REMOVE FAVORITE
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const removedId = action.payload;
        if (state.user && state.user.noticesFavorites) {
          state.user.noticesFavorites = state.user.noticesFavorites.filter(
            (pet) => String(pet?._id || pet?.id || pet) !== String(removedId)
          );
        }
      });
  },
});

export const authReducer = authSlice.reducer;