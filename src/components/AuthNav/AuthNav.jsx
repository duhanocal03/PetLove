import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // 🚀 Redux bağlantıları ekalndi
import { logOut } from '../../redux/auth/operations'; // 🚀 Path'i kontrol edersin
import styles from './AuthNav.module.css';

const AuthNav = ({ isHome }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Kullanıcı giriş durumunu çek

  // 🟢 Eğer kullanıcı giriş yapmışsa, butonlar yerine profil linki ve çıkış butonu göster
  if (isLoggedIn) {
    return (
      <div className={styles.authWrapper}>
        <Link 
          to="/profile" 
          className={`${styles.loginBtn} ${isHome ? styles.homeLoginBtn : ''}`}
        >
          MY PROFILE
        </Link>
        <button 
          type="button"
          onClick={() => dispatch(logOut())}
          className={`${styles.registerBtn} ${isHome ? styles.homeRegisterBtn : ''}`}
        >
          LOG OUT
        </button>
      </div>
    );
  }

  // 🔴 Kullanıcı giriş yapmamışsa eski butonları göstermeye devam et
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