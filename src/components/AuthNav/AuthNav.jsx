import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../Navbar/Navbar.module.css';

const AuthNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.authButtons}>
      <button 
        className={location.pathname === '/login' ? 'login-page-button' : 'register-page-button'} 
        onClick={() => navigate('/login')}
      >
        LOG IN
      </button>
      <button 
        className={location.pathname === '/register' ? 'login-page-button' : 'register-page-button'} 
        onClick={() => navigate('/register')}
      >
        REGISTRATION
      </button>
    </div>
  );
};

export default AuthNav;