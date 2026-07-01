import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, redirectTo = '/login' }) => {
  // Aynı şekilde test için sahte değişken:
  const isLoggedIn = false; 

  return !isLoggedIn ? <Navigate to={redirectTo} /> : <Component />;
};