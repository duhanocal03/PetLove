import { useEffect, useState } from 'react';
import styles from './Loading.module.css'; 
import LoadingImg from "../../assets/Loading.png"; 

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className={styles.container} 
      style={{ backgroundImage: `url(${LoadingImg})` }}
    >
      <div className={styles.mainWrapper}>
        <div className={styles.logoWrapper}>
          <h1 className={styles.logoText}>
            petl<span className={styles.heart}>♥</span>ve
          </h1>
        </div>

        <div className={styles.progressContainer}>
          <svg className={styles.svgCircle} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="var(--color-white)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.03s linear' }}
            />
          </svg>
          <span className={styles.progressText}>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;