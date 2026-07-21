import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaTimes, FaCamera, FaUser } from 'react-icons/fa';
import { updateUser, refreshUser } from '../../redux/auth/operations';
import styles from './EditUserModal.module.css';

const EditUserModal = ({ user, onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Geçici bir önizleme URL'i oluşturuyoruz
      const imageUrl = URL.createObjectURL(file);
      setPreviewAvatar(imageUrl);
      
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar,
      };

      // Backend güncellemesi başarılı olursa avatarı localStorage'a kaydediyoruz
      if (formData.avatar) {
        localStorage.setItem('savedUserAvatar', formData.avatar);
      }

      await dispatch(updateUser(dataToSubmit)).unwrap();
      await dispatch(refreshUser());

      onClose();
    } catch (error) {
      console.error("Profil güncellenemedi:", error);
      setErrorMessage('Güncelleme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>

        <h2 className={styles.modalTitle}>Edit information</h2>

        {errorMessage && <div className={styles.errorBanner}>{errorMessage}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {previewAvatar ? (
                <img src={previewAvatar} alt="Avatar Preview" className={styles.avatarImg} />
              ) : (
                <FaUser className={styles.defaultAvatarIcon} />
              )}
            </div>
            
            <div className={styles.uploadRow}>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Avatar URL"
                className={styles.avatarUrlInput}
              />
              <label className={styles.uploadLabel}>
                Upload photo <FaCamera style={{ marginLeft: '6px' }} />
                <input type="file" className={styles.fileInput} accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+380..."
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.saveBtn}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;