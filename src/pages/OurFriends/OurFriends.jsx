import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './OurFriends.module.css';

const api = axios.create({
  baseURL: 'https://petlove.b.goit.study/api',
});

const OurFriends = () => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get('/friends');
        setFriends(response.data);
      } catch (error) {
        console.error("Arkadaşlar yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const getHours = (workDays) => {
    if (!workDays || workDays.length === 0) return "Day and night";
    const today = workDays.find(day => day.isOpen);
    return today ? `${today.from} - ${today.to}` : "Closed";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our friends</h1>

      {isLoading && <p>Loading...</p>}

      <div className={styles.friendsGrid}>
        {friends.map((friend) => (
          <article key={friend._id} className={styles.card}>
            <div className={styles.timeBadge}>
              {getHours(friend.workDays)}
            </div>

            <div className={styles.imageWrapper}>
              <img src={friend.imageUrl} alt={friend.title} className={styles.cardImage} />
            </div>

            <div className={styles.info}>
              <h2 className={styles.name}>
                <a href={friend.url} target="_blank" rel="noopener noreferrer">{friend.title}</a>
              </h2>

              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span> {friend.email || 'N/A'}
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Address:</span>
                <a href={friend.addressUrl} target="_blank" rel="noopener noreferrer">{friend.address || 'website only'}</a>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Phone:</span>
                <a href={`tel:${friend.phone}`}>{friend.phone || 'email only'}</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OurFriends;