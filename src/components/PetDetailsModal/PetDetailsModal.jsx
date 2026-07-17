import styles from './PetDetailsModal.module.css';

const PetDetailsModal = ({ pet, onClose }) => {
  if (!pet) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.imageWrapper}>
          <img src={pet.imgURL} alt={pet.title} className={styles.petImage} />
          <div className={styles.sellBadge}>{pet.category || 'Sell'}</div>
        </div>

        <h2 className={styles.title}>{pet.title}</h2>
        
        <div className={styles.infoRow}>
          <div className={styles.infoGroup}>
            <p className={styles.label}>Name</p> <p className={styles.value}>{pet.name}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.label}>Birthday</p> <p className={styles.value}>{pet.birthday}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.label}>Sex</p> <p className={styles.value}>{pet.sex}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.label}>Species</p> <p className={styles.value}>{pet.species}</p>
          </div>
        </div>

        <p className={styles.comment}>{pet.comment}</p>
        <p className={styles.price}>{pet.price ? `$${pet.price}` : '$257.99'}</p>

        <div className={styles.actions}>
          <button className={styles.addBtn}>Add to &hearts;</button>
          <button className={styles.contactBtn}>Contact</button>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsModal;