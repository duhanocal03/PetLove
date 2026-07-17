import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchNotices } from '../../redux/notices/operations';
import styles from './FindPet.module.css';
import heartIcon from '../../assets/Heart.svg';
import starIcon from '../../assets/star.png';
import PetDetailsModal from '../../components/PetDetailsModal/PetDetailsModal';
import AuthAttentionModal from '../../components/AuthAttentionModal/AuthAttentionModal';

// yedek resim 
const FALLBACK_IMAGE = 'https://placehold.co/340x200/FFF9F0/fdb022?text=No+Image';

const FALLBACK_CATEGORIES = ['young', 'old', 'lost', 'found', 'good-hands'];
const FALLBACK_GENDERS = ['female', 'male', 'multiple'];
const FALLBACK_SPECIES = ['dog', 'cat', 'monkey', 'bird', 'snake'];


const FindPet = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Modalın açık olup olmadığını tutar
const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
const [selectedPet, setSelectedPet] = useState(null);
  //  Redux'tan gelen tüm veriler 
  const { 
    items: notices, 
    totalPages, 
    isLoading, 
    error 
  } = useSelector(
    (state) => state.notices || { items: [], totalPages: 1, isLoading: false, error: null }
  );

  // Filtre Seçenekleri State'leri
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  // Kullanıcı Seçimleri
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');

  // Dropdown Açık/Kapalı Kontrolü
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Lokasyon değerinin string mi yoksa nesne mi olduğunu çözen fonksiyon
  const getLocValue = (loc) => {
    if (!loc) return '';
    if (typeof loc === 'string') return loc;
    return loc.city || loc.name || loc.location || loc.cityEn || '';
  };

  // API Metadata Çekimi (Kategoriler, cinsiyetler vb.)
  useEffect(() => {
    const fetchFilterMetadata = async () => {
      try {
        const [catRes, sexRes, specRes, locRes] = await Promise.all([
          axios.get('/notices/categories'),
          axios.get('/notices/sex'),
          axios.get('/notices/species'),
          axios.get('/cities/locations')
        ]);
        
        setCategories(catRes.data || FALLBACK_CATEGORIES);
        setGenders(sexRes.data || FALLBACK_GENDERS);
        setSpeciesList(specRes.data || FALLBACK_SPECIES);
        setAllLocations(locRes.data || []);
      } catch (err) {
        console.warn('Filtre seçenekleri API’den alınamadı, yedekler yükleniyor:', err);
        setCategories(FALLBACK_CATEGORIES);
        setGenders(FALLBACK_GENDERS);
        setSpeciesList(FALLBACK_SPECIES);
      }
    };

    fetchFilterMetadata();
  }, []);

  // Dropdown dışına tıklandığında menüleri kapatma
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filtreler veya sayfa değiştikçe API tetikleme
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 6,
      keyword: search.trim() || undefined,
      category: category && category !== 'all' ? category.toLowerCase() : undefined,
      sex: gender && gender !== 'all' ? gender.toLowerCase() : undefined,
      species: type && type !== 'all' ? type.toLowerCase() : undefined,
      location: location.trim() || undefined,
      byPopularity: selectedTag === 'popular' ? true : selectedTag === 'unpopular' ? false : undefined,
      byPrice: selectedTag === 'expensive' ? true : selectedTag === 'cheap' ? false : undefined,
    };

    dispatch(fetchNotices(params));
  }, [dispatch, search, category, gender, type, location, selectedTag, currentPage]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1); // Filtre değiştiğinde 1. sayfaya sıfırla
    setOpenDropdown(null);
  };

  const handleProtectedAction = (action) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      action();
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleTagClick = (tag) => {
    setCurrentPage(1);
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  // Konum Önerilerini Filtreleme
  const filteredLocations = location.trim()
    ? allLocations.filter((loc) => {
        const stringVal = getLocValue(loc);
        return stringVal.toLowerCase().includes(location.toLowerCase());
      }).slice(0, 5)
    : [];

  // Sayfalama Numaralandırma Mantığı
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisibleButtons = 3;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`${styles.pageButton} ${currentPage === i ? styles.activePageButton : ''}`}
          >
            {i}
          </button>
        );
      }
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, currentPage + 1);

      if (currentPage === 1) endPage = 3;
      if (currentPage === totalPages) startPage = totalPages - 2;

      if (startPage > 1) {
        pages.push(
          <button
            key={1}
            onClick={() => setCurrentPage(1)}
            className={`${styles.pageButton} ${currentPage === 1 ? styles.activePageButton : ''}`}
          >
            1
          </button>
        );
        if (startPage > 2) {
          pages.push(<span key="dots-left" className={styles.dots}>...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`${styles.pageButton} ${currentPage === i ? styles.activePageButton : ''}`}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(<span key="dots-right" className={styles.dots}>...</span>);
        }
        pages.push(
          <button
            key={totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={`${styles.pageButton} ${currentPage === totalPages ? styles.activePageButton : ''}`}
          >
            {totalPages}
          </button>
        );
      }
    }
    return pages;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Find your favorite pet</h1>

        {/* Filtreleme Paneli */}
        <div className={styles.filterPanel} ref={dropdownRef}>
          <div className={styles.filterRow}>
            
            {/* Arama Girişi */}
            <div className={styles.searchWrapper}>
              <div className={`${styles.inputFieldBox} ${search ? styles.inputFieldBoxActive : ''}`}>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={styles.inputField}
                />
                <div className={styles.inputActionGroup}>
                  {search && (
                    <button 
                      type="button" 
                      className={styles.clearBtn} 
                      onClick={() => { setSearch(''); setCurrentPage(1); }}
                    >
                      ×
                    </button>
                  )}
                  <svg className={styles.inputIconStatic} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
            </div>

            {/* Dropdown: Category */}
            <div className={styles.customDropdown}>
              <div 
                className={`${styles.dropdownTrigger} ${openDropdown === 'category' ? styles.dropdownTriggerActive : ''}`} 
                onClick={() => toggleDropdown('category')}
              >
                <span>{category && category !== 'all' ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category'}</span>
                <svg className={`${styles.arrowIcon} ${openDropdown === 'category' ? styles.arrowOpen : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {openDropdown === 'category' && (
                <div className={styles.dropdownMenu}>
                  <div className={`${styles.dropdownItem} ${!category || category === 'all' ? styles.dropdownItemActive : ''}`} onClick={() => handleFilterChange(setCategory, 'all')}>Show all</div>
                  {categories.map((catItem) => (
                    <div 
                      key={catItem} 
                      className={`${styles.dropdownItem} ${category === catItem ? styles.dropdownItemActive : ''}`} 
                      onClick={() => handleFilterChange(setCategory, catItem)}
                    >
                      {catItem.charAt(0).toUpperCase() + catItem.slice(1).replace('-', ' ')}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/*Dropdown: By gender */}
            <div className={styles.customDropdown}>
              <div 
                className={`${styles.dropdownTrigger} ${openDropdown === 'gender' ? styles.dropdownTriggerActive : ''}`} 
                onClick={() => toggleDropdown('gender')}
              >
                <span>{gender && gender !== 'all' ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'By gender'}</span>
                <svg className={`${styles.arrowIcon} ${openDropdown === 'gender' ? styles.arrowOpen : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {openDropdown === 'gender' && (
                <div className={styles.dropdownMenu}>
                  <div className={`${styles.dropdownItem} ${!gender || gender === 'all' ? styles.dropdownItemActive : ''}`} onClick={() => handleFilterChange(setGender, 'all')}>Show all</div>
                  {genders.map((genderItem) => (
                    <div 
                      key={genderItem} 
                      className={`${styles.dropdownItem} ${gender === genderItem ? styles.dropdownItemActive : ''}`} 
                      onClick={() => handleFilterChange(setGender, genderItem)}
                    >
                      {genderItem.charAt(0).toUpperCase() + genderItem.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown: By type */}
            <div className={styles.customDropdown}>
              <div 
                className={`${styles.dropdownTrigger} ${openDropdown === 'type' ? styles.dropdownTriggerActive : ''}`} 
                onClick={() => toggleDropdown('type')}
              >
                <span>{type && type !== 'all' ? type.charAt(0).toUpperCase() + type.slice(1) : 'By type'}</span>
                <svg className={`${styles.arrowIcon} ${openDropdown === 'type' ? styles.arrowOpen : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {openDropdown === 'type' && (
                <div className={styles.dropdownMenu}>
                  <div className={`${styles.dropdownItem} ${!type || type === 'all' ? styles.dropdownItemActive : ''}`} onClick={() => handleFilterChange(setType, 'all')}>Show all</div>
                  {speciesList.map((specItem) => (
                    <div 
                      key={specItem} 
                      className={`${styles.dropdownItem} ${type === specItem ? styles.dropdownItemActive : ''}`} 
                      onClick={() => handleFilterChange(setType, specItem)}
                    >
                      {specItem.charAt(0).toUpperCase() + specItem.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/*  Konum Girişi*/}
            <div className={styles.locationWrapper}>
              <div className={`${styles.inputFieldBox} ${openDropdown === 'location' || location ? styles.inputFieldBoxActive : ''}`} onClick={() => toggleDropdown('location')}>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setCurrentPage(1);
                    if (openDropdown !== 'location') setOpenDropdown('location');
                  }}
                  className={styles.inputField}
                />
                <div className={styles.inputActionGroup}>
                  {location && (
                    <button 
                      type="button" 
                      className={styles.clearBtn} 
                      onClick={(e) => {
                        e.stopPropagation(); // Menünün tekrardan tetiklenmesini engeller
                        setLocation('');
                        setCurrentPage(1);
                      }}
                    >
                      ×
                    </button>
                  )}
                  <svg className={styles.inputIconStatic} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
              {openDropdown === 'location' && filteredLocations.length > 0 && (
                <div className={styles.dropdownMenu}>
                  {filteredLocations.map((locItem) => {
                    const displayValue = getLocValue(locItem);
                    const uniqueKey = locItem._id || locItem.id || displayValue;

                    return (
                      <div 
                        key={uniqueKey} 
                        className={styles.dropdownItem} 
                        onClick={() => handleFilterChange(setLocation, displayValue)}
                      >
                        {displayValue}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Alt Etiket Satırı */}
          <div className={styles.tagRow}>
            {['popular', 'unpopular', 'cheap', 'expensive'].map((tag) => (
              <button
                key={tag}
                className={`${styles.tagButton} ${selectedTag === tag ? styles.tagButtonActive : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                {selectedTag === tag && <span className={styles.closeIcon}>×</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Durum Göstergeleri */}
        {isLoading && <p>Loading pets...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}

        {/*  İlan Kartları */}
        {!isLoading && (
          <div className={styles.petGrid}>
            {notices && notices.length > 0 ? (
                          notices.map((pet) => {
              const imageSource = pet.imgURL || pet.imgUrl || pet.imageUrl || pet.image || pet.avatar || FALLBACK_IMAGE;

                return (
                  <article key={pet._id || pet.id} className={styles.petCard}>
                    <div className={styles.imageWrapper}>
                      <img 
                        src={imageSource} 
                        alt={pet.title} 
                        className={styles.petImage} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>

                    <div className={styles.cardHeader}>
                      <h2 className={styles.petName}>{pet.title}</h2>
                      <div className={styles.ratingBadge}>
                        <span className={styles.starIcon}><img src={starIcon} alt="Star Icon" /></span> {pet.popularity || 1}
                      </div>
                    </div>

                    {/* Özellikler Tablosu */}
                    <div className={styles.specTable}>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Name</span>
                        <span className={styles.specValue}>{pet.name || 'Unknown'}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Birthday</span>
                        <span className={styles.specValue}>{pet.birthday || 'Unknown'}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Sex</span>
                        <span className={styles.specValue}>{pet.sex || 'Unknown'}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Species</span>
                        <span className={styles.specValue}>{pet.species || 'Unknown'}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Category</span>
                        <span className={styles.specValue}>{pet.category}</span>
                      </div>
                    </div>

                    <p className={styles.description}>{pet.comment || pet.text}</p>
                    <div className={styles.price}>${pet.price || 'Free'}</div>

                    {/* Alt Butonlar */}
                    <div className={styles.cardActions}>
                      <button 
  className={styles.learnMoreBtn} 
  onClick={() => handleProtectedAction(() => setSelectedPet(pet))}
>
  Learn more
</button>
                      <button 
  className={styles.favoriteBtn} 
  onClick={() => handleProtectedAction(() => console.log("Favori işlemi"))}
>
  <img src={heartIcon} alt="heart" />
</button>
                    </div>
                  </article>
                );
              })
            ) : (
              !isLoading && <p>No pets found matching the filters.</p>
            )}
          </div>
        )}

        {/* Sayfalama (Artık totalPages kullanıldığı için ESLint hatası vermez) */}
        {!isLoading && totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={styles.pageButton}>«</button>
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={styles.pageButton}>‹</button>
            {renderPageNumbers()}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={styles.pageButton}>›</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className={styles.pageButton}>»</button>
          </div>
        )}
        {selectedPet && (
  <PetDetailsModal 
    pet={selectedPet} 
    onClose={() => setSelectedPet(null)} 
          /> 
        )}
        {isAuthModalOpen && (
          <AuthAttentionModal onClose={() => setIsAuthModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default FindPet;