import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home'
import Loading from './pages/Loading/Loading'; 
import SharedLayout from './components/SharedLayout/SharedLayout';
import { RestrictedRoute } from './routes/RestrictedRoute/RestrictedRoute';
import { PrivateRoute } from './routes/PrivateRoute/PrivateRoute';
import News from './pages/News/News';
import Profile from './pages/Profile/Profile';

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Sayfa ilk yüklendiğinde simülasyon süresi (örn: 3 saniye) Loading ekranını aktif tutuyoruz.
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1660); // Loading sayfasındaki %100 olma süresine yakın bir değer

    return () => clearTimeout(timer);
  }, []);

  // 1. Durum: Uygulama ilk açılışta veya F5 anında direkt Loading gelir
  if (isAppLoading) {
    return <Loading />;
  }

  // 2. Durum: Yüklenme bittikten sonra normal route lar devreye girer
  return (
  <Routes>
      {/* 🌟 SHARED LAYOUT: Tüm sayfaların tepesinde ortak Navbar görünmesini sağlar */}
      <Route path="/" element={<SharedLayout />}>
        
        {/* 🏠 Ana Giriş Sayfası (Kök Dizin) - Herkese Açık */}
        <Route index element={<Home />} />

        {/* 🟢 Genel Sayfalar (Public) - Herkese Açık */}
        <Route path="news" element={<News />} />

        {/* 🟡 Kısıtlı Sayfalar (Restricted) - Giriş yapanlar buraya girerse otomatik olarak içerideki bir sayfaya (örn: /news) şutlanır */}
        <Route 
          path="login" 
          element={<RestrictedRoute component={Login} redirectTo="/news" />} 
        />
        <Route 
          path="register" 
          element={<RestrictedRoute component={Register} redirectTo="/news" />} 
        />

        {/* 🔴 Gizli/Özel Sayfalar (Private) - Giriş yapmayanlar buraya girmeye çalışırsa kapı dışarı edilip /login'e şutlanır */}
        <Route 
          path="profile" 
          element={<PrivateRoute component={Profile} redirectTo="/login" />} 
        />

      </Route>

      {/* Yanlış veya bilinmeyen bir link yazıldığında direkt Home sayfasına yönlendir */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}