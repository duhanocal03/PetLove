import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPencilAlt, FaCamera, FaStar, FaTrash, FaPlus } from 'react-icons/fa';
import { addFavorite, removeFavorite } from '../../redux/notices/operations';
import { refreshUser, deleteMyPet } from '../../redux/auth/operations'; 
import PetDetailsModal from '../../components/PetDetailsModal/PetDetailsModal';
import EditUserModal from '../../components/EditUserModal/EditUserModal';
import LogoutModal from '../../components/LogoutModal/LogoutModal';
import styles from './Profile.module.css';
import heartIcon from '../../assets/Heart.svg';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const favoritePets = useSelector((state) => state.auth.user?.noticesFavorites || []);
  const favoriteIds = favoritePets.map(fav => fav?._id || fav?.id || fav);

  const myPets = user?.pets || [];

  const [activeTab, setActiveTab] = useState('favorites');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [viewedPets, setViewedPets] = useState(() => {
    return JSON.parse(localStorage.getItem('viewedPets') || '[]');
  });
  
  const [selectedPet, setSelectedPet] = useState(null);

  const handleTabGroupChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'viewed') {
      const storedViewed = JSON.parse(localStorage.getItem('viewedPets') || '[]');
      setViewedPets(storedViewed);
    }
  };

  const handleRemoveFavorite = (petId) => {
    dispatch(removeFavorite(petId));
  };

  const handleToggleFavorite = async (petId) => {
    const petIdString = String(petId);
    const isAlreadyFavorite = favoriteIds.some((fav) => String(fav?._id || fav?.id || fav) === petIdString);

    if (isAlreadyFavorite) {
      await dispatch(removeFavorite(petId));
    } else {
      await dispatch(addFavorite(petId));
    }
    
    dispatch(refreshUser());
  };

  // PET SİLME FONKSİYONU
  const handleDeleteMyPet = (petId) => {
    if (!petId) {
      console.error("Geçersiz Pet ID!");
      return;
    }
    dispatch(deleteMyPet(petId));
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userCard}>
        <div className={styles.userBadge}>
          <FaUser style={{ marginRight: '6px' }} /> User
        </div>

        <button 
          type="button" 
          className={styles.topEditBtn}
          onClick={() => setIsEditModalOpen(true)}
          title="Edit information"
        >
          <FaPencilAlt />
        </button>
        
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name || 'User'} className={styles.avatarImg} />
            ) : (
              <FaUser className={styles.defaultAvatarIcon} />
            )}
          </div>
          <label className={styles.uploadLabel} onClick={() => setIsEditModalOpen(true)}>
            <FaCamera className={styles.cameraIcon} />
            <span>Upload photo</span>
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>My information</label>
          <div className={styles.inputWrapper}>
            <input type="text" value={user?.name || ''} disabled className={`${styles.input} ${styles.disabledInput}`} />
          </div>
          <div className={styles.inputWrapper}>
            <input type="email" value={user?.email || ''} disabled className={`${styles.input} ${styles.disabledInput}`} />
          </div>
          <div className={styles.inputWrapper}>
            <input type="text" value={user?.phone || ''} placeholder="+380" disabled className={`${styles.input} ${styles.disabledInput}`} />
          </div>
        </div>

        {/* --- KULLANICININ KENDİ PETLERİ --- */}
        <div className={styles.myPetsSection}>
          <div className={styles.myPetsHeader}>
            <span className={styles.myPetsTitle}>My pets</span>
            <button 
              type="button" 
              className={styles.addPetBtn}
              onClick={(e) => {
                e.preventDefault();
                navigate('/add-pet');
              }}
            >
              Add pet <FaPlus style={{ marginLeft: '4px' }} />
            </button>
          </div>

          <div className={styles.myPetsListContainer}>
            {myPets.length > 0 ? (
              myPets.map((pet) => {
                
                // ID eşleştirmesi
                const currentPetId = pet._id || pet.id;
                const petImage = pet.imgURL || pet.imageUrl || pet.image;

                return (
                  <div key={currentPetId} className={styles.myPetCard}>
                    {petImage ? (                     
                      <img src={petImage} alt={pet.name || pet.title} className={styles.myPetImg} />                   
                    ) : (
                        <div className={`${styles.myPetImg} ${styles.myPetImagePlaceholder}`}> 
                          <span>No photo</span>
                      </div>
                    )}

                    <div className={styles.myPetInfoContainer}>
                      
                      <h4 className={styles.myPetCardTitle}>
                        
                        {pet.title || pet.breed || pet.species || 'My Pet'}
                        
                      </h4>                         
                      <div className={styles.myPetDetailsGrid}> 
                        <div className={styles.myPetDetailItem}>                     
                          <span className={styles.myPetLabel}>Name</span>                         
                          <span className={styles.mypetValue}>{pet.name || '-'}</span>                         
                        </div>
                        
      
      <div className={styles.myPetDetailItem}>
        <span className={styles.myPetLabel}>Birthday</span>
        <span className={styles.mypetValue}>
          {pet.birthday ? pet.birthday.replace(/-/g, '.') : (pet.dateOfBirth ? pet.dateOfBirth.replace(/-/g, '.') : '-')}
        </span>
      </div>
      
      <div className={styles.myPetDetailItem}>
        <span className={styles.myPetLabel}>Sex</span>
        <span className={styles.mypetValue}>{pet.sex || '-'}</span>
      </div>
      
      <div className={styles.myPetDetailItem}>
        <span className={styles.myPetLabel}>Species</span>
        <span className={styles.mypetValue}>{pet.species || '-'}</span>
      </div>
    </div>
  </div>

  <button 
    type="button" 
    onClick={() => handleDeleteMyPet(currentPetId)}
    className={styles.myPetDeleteBtn}
    title="Delete pet"
  >
    <FaTrash size={14} />
  </button>
                  </div>
                );
              })
            ) : (
              <p className={styles.myPetsEmptyText}>You haven't added any pets yet.</p>
            )}
          </div>
        </div>

        <button 
          type="button" 
          className={styles.logoutBtn}
          onClick={() => setIsLogoutModalOpen(true)}
        >
          LOG OUT
        </button>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.tabsHeader}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
            onClick={() => handleTabGroupChange('favorites')}
          >
            My favorite pets
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'viewed' ? styles.activeTab : ''}`}
            onClick={() => handleTabGroupChange('viewed')}
          >
            Viewed
          </button>
        </div>

        <div className={styles.petsGrid}>
          {activeTab === 'favorites' && (
            favoritePets && favoritePets.length > 0 ? (
              favoritePets.map((pet, index) => {
                const petId = pet?._id || pet?.id;

                return (
                  <div key={petId ? `${petId}-${index}` : `fav-${index}`} className={styles.petCard}>
                    <div className={styles.cardImageContainer}>
                      <img 
                          src={pet.imgURL || pet.image || pet.imageUrl}          
                          alt={pet.title || pet.name}                
                          className={styles.petImage}
                      />
                      <span className={styles.categoryBadge}>{pet.category}</span>
                      <div className={styles.ratingBadge}>
                        <FaStar className={styles.starIcon} /> {pet.rating || pet.popularity || 0}
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.petTitle}>{pet.title || pet.name}</h3>
                      
                      <div className={styles.petDetailsGrid}>
                        <div><span>Name</span><p>{pet.name}</p></div>
                        <div><span>Birthday</span><p>{pet.birthday || '-'}</p></div>
                        <div><span>Sex</span><p>{pet.sex || '-'}</p></div>
                        <div><span>Species</span><p>{pet.species || '-'}</p></div>
                      </div>

                      <p className={styles.petDescription}>{pet.description || pet.comment || pet.text}</p>

                      <div className={styles.cardFooter}>
                        <span className={styles.petPrice}>{pet.price ? `$${pet.price}` : ''}</span>
                        <button 
                          type="button" 
                          className={styles.learnMoreBtn}
                          onClick={() => setSelectedPet(pet)}
                        >
                          Learn more
                        </button>
                        <button 
                          type="button" 
                          className={styles.deleteCardBtn}
                          onClick={() => handleRemoveFavorite(petId)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <p>Oops, <span className={styles.emptySpan}>looks like there aren't any furries</span>  on our adorable page yet. Do not worry! View your pets on the "find your favorite pet" page and add them to your favorites.</p>
              </div>
            )
          )}

          {activeTab === 'viewed' && (
            viewedPets && viewedPets.length > 0 ? (
              viewedPets.map((pet, index) => {
                const petId = pet?._id || pet?.id;
                const isFavorite = favoriteIds.some((fav) => String(fav?._id || fav?.id || fav) === String(petId));

                return (
                  <div key={petId ? `${petId}-${index}` : `viewed-${index}`} className={styles.petCard}>
                    <div className={styles.cardImageContainer}>
                      <img 
                          src={pet.imgURL || pet.image || pet.imageUrl}          
                          alt={pet.title || pet.name}                
                          className={styles.petImage}
                      />
                      <span className={styles.categoryBadge}>{pet.category}</span>
                      <div className={styles.ratingBadge}>
                        <FaStar className={styles.starIcon} /> {pet.rating || pet.popularity || 0}
                      </div>
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.petTitle}>{pet.title || pet.name}</h3>
                      
                      <div className={styles.petDetailsGrid}>
                        <div><span>Name</span><p>{pet.name}</p></div>
                        <div><span>Birthday</span><p>{pet.birthday || '-'}</p></div>
                        <div><span>Sex</span><p>{pet.sex || '-'}</p></div>
                        <div><span>Species</span><p>{pet.species || '-'}</p></div>
                      </div>

                      <p className={styles.petDescription}>{pet.description || pet.comment || pet.text}</p>

                      <div className={styles.cardFooter}>
                        <span className={styles.petPrice}>{pet.price ? `$${pet.price}` : ''}</span>
                        <button 
                          type="button" 
                          className={styles.learnMoreBtn}
                          onClick={() => setSelectedPet(pet)}
                        >
                          Learn more
                        </button>
                        <button 
                          className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`} 
                          onClick={() => handleToggleFavorite(petId)}
                          style={isFavorite ? { backgroundColor: '#fdb022' } : {}}
                        >
                          <img 
                            src={heartIcon} 
                            alt="heart" 
                            style={isFavorite ? { filter: 'brightness(0) invert(1)' } : {}} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <p>No viewed pets yet.</p>
              </div>
            )
          )}
        </div>
      </div>

      {selectedPet && (
        <PetDetailsModal 
          pet={selectedPet} 
          onClose={() => setSelectedPet(null)}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
        /> 
      )}

      {isEditModalOpen && (
        <EditUserModal 
          user={user} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}

      {isLogoutModalOpen && (
        <LogoutModal onClose={() => setIsLogoutModalOpen(false)} />
      )}
    </div>
  );
};

export default Profile;