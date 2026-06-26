import { NavLink } from 'react-router-dom';
import styles from '../Navbar/Navbar.module.css'; 

const Nav = () => {
  return (
    <div className={styles.menuLinks}>
      <NavLink 
        to="/news" 
        className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}
      >
        News
      </NavLink>
      <NavLink 
        to="/notices" 
        className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}
      >
        Find pet
      </NavLink>
      <NavLink 
        to="/friends" 
        className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}
      >
        Our friends
      </NavLink>
    </div>
  );
};

export default Nav;