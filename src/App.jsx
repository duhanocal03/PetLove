import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';
import Loading from './pages/Loading/Loading'; 

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Sayfa ilk yüklendiğinde simülasyon süresi (örn: 3 saniye) Loading ekranını aktif tutuyoruz.
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3200); // Loading sayfasındaki %100 olma süresine yakın bir değer

    return () => clearTimeout(timer);
  }, []);

  // 1. Durum: Uygulama ilk açılışta veya F5 anında direkt Loading gelir
  if (isAppLoading) {
    return <Loading />;
  }

  // 2. Durum: Yüklenme bittikten sonra normal route lar devreye girer
  return (
    <Routes>
      {/* Kök dizine gelen kullanıcıyı direkt login e yönlendiriyoruz */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}