import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'; 
import styles from './SharedLayout.module.css';

const SharedLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={styles.layoutContainer}>
      {!isHome && <Navbar />}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default SharedLayout;