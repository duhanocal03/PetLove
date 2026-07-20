import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../redux/auth/operations'; 
import { FaUser } from 'react-icons/fa'; 
import styles from './AuthNav.module.css';

const AuthNav = ({ isHome }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  if (isLoggedIn) {
    return (
      <div className={styles.authWrapper}>

      <button 
          type="button"
          onClick={() => dispatch(logOut())}
          className={`${styles.registerBtn} ${isHome ? styles.homeRegisterBtn : ''}`}
        >
          LOG OUT
        </button>

        <Link 
          to="/profile" 
          className={styles.userProfileLink}
        >
          <div className={styles.avatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || 'User'} className={styles.avatarImg} />
            ) : (
              <FaUser />
            )}
          </div>
          <span className={`${styles.userName} ${isHome ? styles.homeUserName : ''}`}>
            {user?.name || 'User'}
          </span>
        </Link>
      </div>
    );
  }

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