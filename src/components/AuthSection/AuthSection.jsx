import styles from './AuthSection.module.css';

const AuthSection = ({ image, name, birthday, description, icon = "🐶" }) => {
  return (
    <div className={styles.authSectionContainer}>
      {/* Büyük Köpek Resmi ve Arka Plan Dalgaları */}
      <img src={image} alt="Pet" className={styles.heroImage} />

      {/* Havada Asılı Durman Rich Kartı */}
      <div className={styles.infoCard}>
        {/* Sol Taraf: Yuvarlak İkon Alanı */}
        <div className={styles.avatarWrapper}>
          <span className={styles.avatarIcon}>{icon}</span>
        </div>

        {/* Sağ Taraf: Yazı İçerikleri */}
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <h3 className={styles.petName}>{name}</h3>
            <p className={styles.birthdayText}>
              <span className={styles.label}>Birthday:</span> {birthday}
            </p>
          </div>
          <p className={styles.descriptionText}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthSection;