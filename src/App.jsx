import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { refreshUser } from './redux/auth/operations';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Loading from './pages/Loading/Loading'; 
import SharedLayout from './components/SharedLayout/SharedLayout';
import { RestrictedRoute } from './routes/RestrictedRoute/RestrictedRoute';
import { PrivateRoute } from './routes/PrivateRoute/PrivateRoute';
import News from './pages/News/News';
import Profile from './pages/Profile/Profile';
import FindPet from './pages/FindPet/FindPet'
import OurFriends from './pages/OurFriends/OurFriends';
import AddPet from './pages/AddPet/AddPet';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector((state) => state.auth.isRefreshing);
  const token = useSelector((state) => state.auth.token);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Sadece localStorage'da token varsa refresh isteği at, yoksa döngüyü baştan engelle!
    if (token) {
      dispatch(refreshUser());
    }

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1660);

    return () => clearTimeout(timer);
  }, [dispatch, token]);

  // Sadece aktif bir refresh işlemi varken render'ı kilitle
  if (isRefreshing && isInitialLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<Home />} />
        <Route path="news" element={<News />} />
        <Route path="notices" element={<FindPet />} />
        <Route path="friends" element={<OurFriends />} />
        <Route 
          path="login" 
          element={<RestrictedRoute component={Login} redirectTo="/news" />} 
        />
        <Route 
          path="register" 
          element={<RestrictedRoute component={Register} redirectTo="/news" />} 
        />
        <Route 
          path="profile" 
          element={<PrivateRoute component={Profile} redirectTo="/login" />} 
        />
        <Route 
          path="add-pet" 
          element={<PrivateRoute component={AddPet} redirectTo="/login" />} 
        />

        <Route path="*" element={<NotFound/>} />
      </Route>
      
    </Routes>
  );
}