import { Link, NavLink, useLocation } from 'react-router-dom';
import AuthNav from '../AuthNav/AuthNav';
import styles from './Navbar.module.css';
import logoDark from '../../assets/Logo_Desktop_Tablet-1.svg';  
import logoLight from '../../assets/Logo_Desktop_Tablet-2.svg'; 

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Aktiflik durumuna göre CSS sınıflarını birleştiren fonksiyon
  const getNavLinkClass = ({ isActive }) => {
    return `${styles.menuItem} ${isHome ? styles.homeMenuItem : ''} ${isActive ? styles.activeMenuItem : ''}`;
  };

  return (
    <header className={`${styles.navbarContainer} ${isHome ? styles.homeNavbar : ''}`}>
      {/* 1. LOGO */}
      <Link to="/" className={styles.logoWrapper}>
        <img 
          src={isHome ? logoLight : logoDark} 
          alt="petlove logo" 
          className={styles.logoImage} 
        />
      </Link>

      {/* 2. ORTA MENÜ */}
      <nav className={styles.navigationMenu}>
        <NavLink to="/news" className={getNavLinkClass}>News</NavLink>
        <NavLink to="/find-pet" className={getNavLinkClass}>Find pet</NavLink>
        <NavLink to="/friends" className={getNavLinkClass}>Our friends</NavLink>
      </nav>

      {/* 3. SAĞ TARAF */}
      <div className={styles.rightSection}>
        <AuthNav isHome={isHome} />
      </div>
    </header>
  );
};

export default Navbar;