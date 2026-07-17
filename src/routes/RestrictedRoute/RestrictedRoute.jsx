import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * RestrictedRoute: Giriş yapmış kullanıcıların Login ve Register 
 * sayfalarına tekrar erişmesini engeller ve onları ana akışa yönlendirir.
 */
export const RestrictedRoute = ({ component: Component, redirectTo = '/' }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  //  Kullanıcı giriş yaptıysa (veya yeni kayıt olduysa) direkt içeri fırlat
  return isLoggedIn ? <Navigate to={redirectTo} replace /> : <Component />;
};