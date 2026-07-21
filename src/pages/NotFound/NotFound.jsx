import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import cat404 from '../../assets/404.png'; 

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.card}>
        {/* 404 Rakamları ve Kedi Alanı */}
        <div className={styles.errorWrapper}>
          <span className={styles.digit}>4</span>
          <div className={styles.catCircle}>
            <img src={cat404} alt="404 Cat" className={styles.catImg} />
          </div>
          <span className={styles.digit}>4</span>
        </div>

        {/* Mesaj ve Ana Sayfaya Dön Butonu */}
        <p className={styles.message}>Ooops! This page not found :(</p>
        
        <Link to="/" className={styles.homeBtn}>
          To home page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;