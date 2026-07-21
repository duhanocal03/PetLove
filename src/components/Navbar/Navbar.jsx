import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AuthNav from '../AuthNav/AuthNav';
import styles from './Navbar.module.css';
import logoDark from '../../assets/Logo_Desktop_Tablet-1.svg';  
import logoLight from '../../assets/Logo_Desktop_Tablet-2.svg'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  // Register veya Login sayfasında olup olmadığımızın kontrolü
  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Masaüstü navigasyon link sınıfları
  const getNavLinkClass = ({ isActive }) => {
    return `${styles.menuItem} ${isHome ? styles.homeMenuItem : ''} ${isActive ? styles.activeMenuItem : ''}`;
  };

  // Mobil / Tablet çekmece menü link sınıfları
  const getMobileNavLinkClass = ({ isActive }) => {
    return `${styles.mobileMenuItem} ${isActive ? styles.mobileActiveMenuItem : ''}`;
  };

  return (
    <header className={`${styles.navbarContainer} ${isHome ? styles.homeNavbar : ''}`}>
      {/* LOGO */}
      <Link to="/" className={styles.logoWrapper} onClick={closeMenu}>
        <img 
          src={isHome ? logoLight : logoDark} 
          alt="petlove logo" 
          className={styles.logoImage} 
        />
      </Link>

      {/*ORTA MENÜ (Sadece Masaüstünde Görünür) */}
      <nav className={styles.navigationMenu}>
        <NavLink to="/news" className={getNavLinkClass}>News</NavLink>
        <NavLink to="/notices" className={getNavLinkClass}>Find pet</NavLink>
        <NavLink to="/friends" className={getNavLinkClass}>Our friends</NavLink>
      </nav>

      {/* SAĞ KONTROL GRUBU (Tablet ve Masaüstünde AuthNav + Burger Yan Yana) */}
      <div className={styles.rightControlGroup}>
        <div className={styles.rightSection}>
          <AuthNav isHome={isHome} />
        </div>

        {/* HAMBURGER BUTONU */}
        <button 
          type="button" 
          className={`${styles.burgerBtn} ${isHome ? styles.homeBurgerBtn : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M4 16H28M4 8H28M4 24H28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* AÇILIR HAMBURGER MENÜ OVERLAY */}
      {isMenuOpen && (
        <div 
          className={`
            ${styles.mobileMenuOverlay} 
            ${isHome ? styles.homeMobileOverlay : ''} 
            ${isAuthPage ? styles.authMobileOverlay : ''}
          `}
        >
          <div className={styles.mobileMenuHeader}>
            <button 
              type="button" 
              className={styles.closeBtn} 
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M24 8L8 24M8 8l16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Sadece Hamburgere Giren Menü Linkleri */}
          <nav className={styles.mobileNavLinks}>
            <NavLink to="/news" className={getMobileNavLinkClass} onClick={closeMenu}>
              News
            </NavLink>
            <NavLink to="/notices" className={getMobileNavLinkClass} onClick={closeMenu}>
              Find pet
            </NavLink>
            <NavLink to="/friends" className={getMobileNavLinkClass} onClick={closeMenu}>
              Our friends
            </NavLink>
          </nav>

          {/* Sadece Mobilde Auth / Profil Alanı */}
          <div className={styles.mobileOnlyAuth}>
            <AuthNav isHome={isHome} closeMenu={closeMenu} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;