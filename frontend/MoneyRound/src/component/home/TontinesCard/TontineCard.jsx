/* import { motion } from 'framer-motion';
import TontineItem from './TontineItem';
import SkeletonTontine from './SkeletonTontine';
import styles from './TontinesCard.module.css';

const TontinesCard = ({ loading, tontinesData, isMobile, isTablet }) => {
  const tontinesToShow = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div className={styles.tontinesCard}>
      <div className={styles.cardHeader}>
        {loading ? (
          <>
            <div className={styles.skeletonText} style={{ width: '40%', height: '24px' }} />
            <div className={styles.skeletonText} style={{ width: '80px', height: '20px', borderRadius: '20px' }} />
          </>
        ) : (
          <>
            <h2>Mes Tontines</h2>
            <span className={styles.seeAll}>Voir tout</span>
          </>
        )}
      </div>
      
      <div className={styles.tontinesGrid}>
        {loading ? (
          [...Array(tontinesToShow)].map((_, i) => <SkeletonTontine key={i} />)
        ) : (
          tontinesData?.slice(0, tontinesToShow).map(tontine => (
            <TontineItem key={tontine.id} tontine={tontine} />
          ))
        )}
      </div>
    </div>
  );
};

export default TontinesCard; */