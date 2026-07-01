import { Link } from 'react-router-dom';
import styles from './AuthNav.module.css';

const AuthNav = ({ isHome }) => {
  return (
    <div className={styles.authWrapper}>
      <Link 
        to="/login" 
        className={`${styles.loginBtn} ${isHome ? styles.homeLoginBtn : ''}`}
      >
        LOG IN
      </Link>
      <Link 
        to="/register" 
        className={`${styles.registerBtn} ${isHome ? styles.homeRegisterBtn : ''}`}
      >
        REGISTRATION
      </Link>
    </div>
  );
};

export default AuthNav;