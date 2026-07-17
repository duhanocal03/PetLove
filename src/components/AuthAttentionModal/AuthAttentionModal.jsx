import styles from './AuthAttentionModal.module.css';
import { useNavigate } from 'react-router-dom';

const AuthAttentionModal = ({ onClose }) => {
    const navigate = useNavigate();
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.iconWrapper}>
          <div className={styles.dogIcon}>🐶</div> 
        </div>

        <h2 className={styles.title}>Attention</h2>
        <p className={styles.message}>
          We would like to remind you that certain functionality is available only to authorized users. 
          If you have an account, please log in with your credentials. 
          If you do not already have an account, you must register to access these features.
        </p>

        <div className={styles.actions}>
                  <button onClick={() => {
                      navigate('/login');
                      onClose();
          }} className={styles.loginBtn}>Log In</button>
         <button onClick={() => {
                      navigate('/register');
                      onClose();
          }} className={styles.registerBtn}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default AuthAttentionModal;