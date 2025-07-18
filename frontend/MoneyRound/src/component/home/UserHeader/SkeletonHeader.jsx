import styles from './styles.module.css';
import { motion } from 'framer-motion';

const SkeletonHeader = () => (
  <motion.header 
    className={styles.header}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className={styles.profile}>
      <div className={`${styles.avatar} ${styles.skeleton}`} />
      <div className={styles.skeletonTextContainer}>
        <div className={`${styles.skeletonText} ${styles.large}`} />
        <div className={`${styles.skeletonText} ${styles.medium}`} />
      </div>
    </div>
    
    <div className={styles.stats}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`${styles.statBadge} ${styles.skeleton}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className={styles.skeletonCircle} />
          <div className={styles.skeletonValue} />
          <div className={styles.skeletonLabel} />
        </motion.div>
      ))}
    </div>
  </motion.header>
);

export default SkeletonHeader;