import { useNavigate } from 'react-router-dom';
import styles from './CongratsModal.module.css';
import catIcon from '../../assets/cat_icon.svg';

const CongratsModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleGoToProfile = () => {
    onClose(); //önce modalı kapatıyoruz
    navigate('/profile'); // Profil sayfasına yönlendiriyoruz 
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        
        <div className={styles.iconContainer}>
          <img src={catIcon} alt="Cat Icon" />
        </div>
        
        <h2 className={styles.title}>Congrats</h2>
        
        <p className={styles.text}>
          The first fluff in the favorites! May your friendship be the happiest and filled with fun.
        </p>
        
        <button 
          className={styles.actionButton} 
          onClick={handleGoToProfile}
        >
          Go to profile
        </button>
      </div>
    </div>
  );
};

export default CongratsModal;