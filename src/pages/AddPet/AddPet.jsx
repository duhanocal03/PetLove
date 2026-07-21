import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addMyPet } from '../../redux/auth/operations';
import { FaCamera, FaChevronDown } from 'react-icons/fa';
import AddPetBanner from '../../assets/AddPetBanner.png';
import styles from './AddPet.module.css';
import { refreshUser } from '../../redux/auth/operations'; // Eğer export adı buysa

const AddPet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sex: 'female',
    imgURL: '',
    title: '',
    name: '',
    birthday: '',
    species: '',
  });

  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [sexOptions, setSexOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // API'den hem türleri hem de cinsiyet seçeneklerini çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speciesRes, sexRes] = await Promise.all([
          axios.get('/notices/species'),
          axios.get('/notices/sex')
        ]);
        setSpeciesOptions(speciesRes.data); // ['dog', 'cat', ...]
        setSexOptions(sexRes.data);         // ['female', 'male', 'multiple', 'unknown']
      } catch (error) {
        console.error("API verileri yüklenemedi:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imgURL: imageUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //  Peti ekle
      await dispatch(addMyPet(formData)).unwrap();
      
      // Kullanıcı bilgilerini (ve dolayısıyla pets dizisini) hemen tazele
      await dispatch(refreshUser()).unwrap();

      // Profile sayfasına yönlendir
      navigate('/profile');
    } catch (error) {
      console.error('Pet eklenirken hata oluştu:', error);
    }
  };

  // Cinsiyete göre ikon eşleştirmesi yardımcı fonksiyonu
  const getSexIcon = (sexType) => {
    switch (sexType) {
      case 'female': return '♀';
      case 'male': return '♂';
      case 'multiple': return '⚥';
      default: return '🐾';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={AddPetBanner} alt="Pet preview" className={styles.sideImage} />
      </div>

      <div className={styles.formWrapper}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Add my pet</h2>
          <span className={styles.subTitle}>/ Personal details</span>
        </div>

        {/* Dinamik Cinsiyet Seçim Butonları */}
        <div className={styles.genderSelector}>
          {sexOptions.map((sexItem) => (
            <button
              key={sexItem}
              type="button"
              className={`${styles.genderBtn} ${formData.sex === sexItem ? styles.activeGender : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, sex: sexItem }))}
              title={sexItem}
            >
              {getSexIcon(sexItem)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.photoUploadRow}>
            <div className={styles.avatarPreview}>
              {formData.imgURL ? (
                <img src={formData.imgURL} alt="Pet" className={styles.previewImg} />
              ) : (
                <span className={styles.pawIcon}>🐾</span>
              )}
            </div>

            <div className={styles.uploadInputs}>
              <input
                type="text"
                name="imgURL"
                value={formData.imgURL}
                onChange={handleChange}
                placeholder="Enter URL"
                className={styles.inputUrl}
              />
              <label className={styles.uploadLabel}>
                Upload photo <FaCamera style={{ marginLeft: '6px' }} />
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className={styles.inputField}
            required
          />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Pet's Name"
            className={styles.inputField}
            required
          />

          <div className={styles.rowInputs}>
            <div className={styles.dateWrapper}>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="00.00.0000"
                className={styles.inputField}
                required
              />
            </div>

            <div className={styles.dropdownContainer}>
              <div 
                className={styles.dropdownHeader} 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>
                  {formData.species 
                    ? formData.species.charAt(0).toUpperCase() + formData.species.slice(1) 
                    : 'Type of pet'}
                </span>
                <FaChevronDown />
              </div>

              {isDropdownOpen && (
                <ul className={styles.dropdownList}>
                  {speciesOptions.map((item) => (
                    <li
                      key={item}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, species: item }));
                        setIsDropdownOpen(false);
                      }}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPet;