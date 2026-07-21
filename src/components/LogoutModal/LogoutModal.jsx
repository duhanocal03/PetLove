import { useDispatch } from 'react-redux';
import { logOut } from '../../redux/auth/operations';
import styles from './LogoutModal.module.css';

const LogoutModal = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleYesClick = () => {
    dispatch(logOut());
    onClose();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        
        <div className={styles.iconWrapper}>
          <span className={styles.catEmoji}>🐱</span>
        </div>

        <h3 className={styles.title}>Already leaving?</h3>

        <div className={styles.actions}>
          <button type="button" className={styles.yesBtn} onClick={handleYesClick}>
            Yes
          </button>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;