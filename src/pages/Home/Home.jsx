import Navbar from '../../components/Navbar/Navbar';
import styles from './Home.module.css';
import homeHeroImg from '../../assets/Home_Banner.png';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.yellowCard}>
        
        <div className={styles.navbarWrapper}>
          <Navbar />
        </div>

        {/* Başlık ve yanındaki açıklama metni */}
        <div className={styles.mainContentRow}>
          <div className={styles.textSection}>
            <h1 className={styles.mainTitle}>
              Take good <span className={styles.lightText}>care</span> of your small pets
            </h1>
          </div>
          
          <div className={styles.subtitleSection}>
            <p className={styles.subtitleText}>
              Choosing a pet for your home is a choice that is meant to enrich 
              your life with immeasurable joy and tenderness.
            </p>
          </div>
        </div>
      </div>

      {/* BÜYÜK GÖRSEL */}
      <div className={styles.imageWrapper}>
        <img src={homeHeroImg} alt="Woman with dog" className={styles.heroImage} />
      </div>
    </div>
  );
};

export default Home;