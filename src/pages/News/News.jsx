import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews } from '../../redux/news/operations';
import styles from './News.module.css';

const News = () => {
  const dispatch = useDispatch();
  
  // Redux'tan gelen state verileri
  const { items: newsItems, totalPages, isLoading, error } = useSelector(
    (state) => state.news || { items: [], totalPages: 1 }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sadece sayfa veya arama sorgusu değiştiğinde API isteği atıyoruz.
  // Arama değiştiğinde sayfa sıfırlamasını doğrudan input elementinin onChange eventinde hallettik.
  useEffect(() => {
    dispatch(fetchNews({ search: searchQuery, page: currentPage, limit: 6 }));
  }, [dispatch, searchQuery, currentPage]);

  // Sayfa Numaralarını Dinamik Oluşturma Mantığı
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisibleButtons = 3; // Ekranda yan yana görünecek maksimum sayı butonu

    // Eğer toplam sayfa sayısı zaten çok azsa (örn: 3 veya daha az), hepsini direkt bas
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
      // 2. Çoklu sayfalarda aktif sayfanın etrafındaki dinamik pencereleri hesapla
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, currentPage + 1);

      // Sınır durumları kontrolü (Eğer 1. sayfadaysak sağa doğru 3 tane göster)
      if (currentPage === 1) {
        endPage = 3;
      }
      // Eğer son sayfadaysak sola doğru 3 tane göster
      if (currentPage === totalPages) {
        startPage = totalPages - 2;
      }

      // Sol tarafa gerekirse "..." ekleme (Eğer startPage 1'den büyükse)
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
          pages.push(
            <span key="dots-left" className={styles.dots}>
              ...
            </span>
          );
        }
      }

      // Dinamik sayı butonlarını bas (Aktif sayfa ve komşuları)
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

      // Sağ tarafa gerekirse "..." ekleme (Eğer endPage son sayfadan küçükse)
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <span key="dots-right" className={styles.dots}>
              ...
            </span>
          );
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
    <div className={styles.pageContainer}>
      {/* Üst Alan: Başlık ve Arama Çubuğu */}
      <div className={styles.headerSection}>
        <h1 className={styles.title}>News</h1>
        
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              //  Çift render'ı ve konsol hatasını önler
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Arama yapıldığı an sayfayı direkt 1. sayfaya çekiyoruz
            }}
            className={styles.searchInput}
          />
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {isLoading && <p>Loading news...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {/* Haber Kartları Izgarası */}
      <div className={styles.newsGrid}>
        {newsItems.map((news) => (
          <article key={news.id || news._id} className={styles.newsCard}>
            <div className={styles.imageWrapper}>
              <img 
                src={news.imgUrl || 'https://via.placeholder.com/340x240'} 
                alt={news.title} 
                className={styles.newsImage} 
              />
            </div>
            
            <h2 className={styles.cardTitle}>{news.title}</h2>
            <p className={styles.cardText}>{news.text}</p>
            
            <div className={styles.cardFooter}>
              <span className={styles.newsDate}>
                {news.date ? new Date(news.date).toLocaleDateString('tr-TR') : '15/03/2023'}
              </span>
              <a 
                href={news.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.readMoreLink}
              >
                Read more
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Sayfalama Kontrolleri */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          {/* En Başa Git */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            «
          </button>

          {/* Bir Önceki Sayfa */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            ‹
          </button>

          {/* Dinamik Numaralar */}
          {renderPageNumbers()}

          {/* Bir Sonraki Sayfa */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            ›
          </button>

          {/* En Sona Git */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default News;