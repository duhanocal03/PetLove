import { Navigate } from 'react-router-dom';

export const RestrictedRoute = ({ component: Component, redirectTo = '/news' }) => {
  // Sadece test amaçlı elle değiştirilebilir sahte bir state:
  // true yaparsan login/register'a girmeyi engeller, false yaparsan izin verir.
  const isLoggedIn = false; 

  return isLoggedIn ? <Navigate to={redirectTo} /> : <Component />;
};