import { Link } from 'react-router-dom';
import Nav from '../Nav/Nav';
import AuthNav from '../AuthNav/AuthNav';
import styles from './Navbar.module.css';
import LogoSvg from '../../assets/Logo_Desktop_Tablet-1.svg';

const Navbar = () => {
  // Şimdilik sahte bir state, thunk'ları bağlayınca burası Redux'tan gelecek
  const isLoggedIn = false; 

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {/* Logo */}
        <Link to="/" className={styles.logoWrapper}>
          <img src={LogoSvg} alt="PetLove Logo" className={styles.logo} />
        </Link>

        {/* Genel Gezinme Rotaları */}
        <Nav />

        {/* Kullanıcı Durumuna Göre Navigasyon */}
        {isLoggedIn ? (
          <div>{/* İleride buraya UserNav gelecek */}</div>
        ) : (
          <AuthNav />
        )}
      </nav>
    </header>
  );
};

export default Navbar;