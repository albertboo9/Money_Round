import { motion } from "framer-motion";
import styles from "./BalanceCard.module.css";

const SkeletonBalance = () => {
  return (
    <div className={styles.container}>
      {/* Skeleton for Main Card */}
      <motion.div
        className={`${styles.mainCard} ${styles.skeleton}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`${styles.cardGradient} ${styles.skeleton}`} />
        <div className={styles.cardHeader}>
          <div className={`${styles.cardIconContainer} ${styles.skeleton}`}>
            <div className={`${styles.cardIcon} ${styles.skeleton}`} />
          </div>
          <div className={styles.skeletonText} style={{ width: '120px', height: '20px' }} />
        </div>
        
        <div className={styles.balanceDisplay}>
          <div className={`${styles.skeletonText} ${styles.balanceAmount}`} style={{ width: '180px', height: '50px' }} />
        </div>
        
        <div className={styles.cardFooter}>
          <div className={`${styles.providerBadge} ${styles.skeleton}`}>
            <div className={styles.skeletonText} style={{ width: '80px', height: '20px' }} />
          </div>
        </div>
      </motion.div>

      {/* Skeleton for Savings Section */}
      <motion.div 
        className={`${styles.compactSavings} ${styles.skeleton}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.savingsHeader}>
          <div className={styles.skeletonText} style={{ width: '150px', height: '24px' }} />
          <div className={`${styles.chevronIcon} ${styles.skeleton}`} />
        </div>
        
        <div className={styles.savingsOverview}>
          <div className={styles.totalSaved}>
            <div className={styles.skeletonText} style={{ width: '100px', height: '18px' }} />
            <div className={styles.skeletonText} style={{ width: '120px', height: '28px', marginTop: '8px' }} />
          </div>
          
          <div className={styles.savingsVisualization}>
            <div className={`${styles.radialChart} ${styles.skeleton}`}>
              <div className={styles.skeletonCircle} />
            </div>
            
            <div className={styles.savingsBreakdown}>
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className={styles.breakdownItem}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className={`${styles.breakdownDot} ${styles.skeleton}`} />
                  <div>
                    <div className={styles.skeletonText} style={{ width: '80px', height: '16px' }} />
                    <div className={styles.skeletonText} style={{ width: '100px', height: '20px', marginTop: '4px' }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Skeleton for Savings Details */}
        <motion.div
          className={styles.savingsDetails}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={`${styles.detailCard} ${styles.skeleton}`}>
            <div className={styles.skeletonText} style={{ width: '140px', height: '20px' }} />
            <div className={styles.detailProgress}>
              <div className={`${styles.progressTrack} ${styles.skeleton}`}>
                <div className={`${styles.progressBar} ${styles.skeleton}`} style={{ width: '60%' }} />
              </div>
              <div className={styles.progressLabel}>
                <div className={styles.skeletonText} style={{ width: '80px', height: '16px' }} />
                <div className={styles.skeletonText} style={{ width: '80px', height: '16px' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Skeleton for Transaction Card */}
      <motion.div
        className={`${styles.transactionCard} ${styles.skeleton}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.transactionHeader}>
          <div className={styles.skeletonText} style={{ width: '120px', height: '24px' }} />
          <div className={styles.skeletonText} style={{ width: '80px', height: '18px' }} />
        </div>
        
        <div className={styles.transactionContent}>
          <div className={`${styles.transactionIcon} ${styles.skeleton}`} />
          <div className={styles.transactionInfo}>
            <div className={styles.skeletonText} style={{ width: '120px', height: '28px' }} />
            <div className={styles.skeletonText} style={{ width: '150px', height: '20px', marginTop: '8px' }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SkeletonBalance;