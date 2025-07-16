import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import './Home.css'; 

export default function Home() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const skeletonVariants = {
    initial: { opacity: 0.5 },
    animate: { 
      opacity: 0.8,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5
      }
    }
  };

  return (
    <motion.div
      className="home-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <header className="home-header">
        <motion.p className="welcome-message" variants={itemVariants}>
          <motion.span 
            className="skeleton-text" 
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            style={{ display: 'inline-block', width: '150px', height: '24px' }}
          />
        </motion.p>
      </header>

      {/* Grid Layout */}
      <div className="home-grid">
        {/* Balance Summary Skeleton */}
        <motion.section className="card balance-card" variants={itemVariants}>
          <motion.div 
            className="skeleton-block" 
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            style={{ height: '150px', borderRadius: '12px' }}
          />
        </motion.section>

        {/* Active Tontines Skeleton */}
        <motion.section className="card tontines-card" variants={itemVariants}>
          <div className="card-header">
            <motion.h2 
              className="skeleton-text" 
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              style={{ width: '60%', height: '28px' }}
            />
            <motion.div 
              className="skeleton-text" 
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              style={{ width: '80px', height: '20px' }}
            />
          </div>
          
          <div className="tontines-grid">
            {[...Array(isMobile ? 1 : 2)].map((_, i) => (
              <motion.div 
                key={i}
                className="skeleton-block"
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                style={{ height: '200px', borderRadius: '8px' }}
              />
            ))}
          </div>
        </motion.section>

        {/* Recent Activity Skeleton */}
        <motion.section className="card activity-card" variants={itemVariants}>
          <div className="card-header">
            <motion.h2 
              className="skeleton-text" 
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              style={{ width: '50%', height: '28px' }}
            />
          </div>
          <div className="activity-list">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                className="activity-item"
                style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}
              >
                <motion.div 
                  className="skeleton-circle"
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <motion.div style={{ flex: 1 }}>
                  <motion.div 
                    className="skeleton-text"
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                    style={{ width: '70%', height: '16px', marginBottom: '8px' }}
                  />
                  <motion.div 
                    className="skeleton-text"
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                    style={{ width: '50%', height: '14px' }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions Skeleton */}
        <motion.section className="card quick-actions-card" variants={itemVariants}>
          <div className="card-header">
            <motion.h2 
              className="skeleton-text" 
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              style={{ width: '50%', height: '28px' }}
            />
          </div>
          <div className="actions-grid">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i}
                className="action-item"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
              >
                <motion.div 
                  className="skeleton-circle"
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
                <motion.div 
                  className="skeleton-text"
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                  style={{ width: '60px', height: '16px' }}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Next Payment Skeleton */}
        <motion.section className="card payment-card" variants={itemVariants}>
          <div className="card-header">
            <motion.h2 
              className="skeleton-text" 
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              style={{ width: '50%', height: '28px' }}
            />
          </div>
          <motion.div 
            className="skeleton-block"
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            style={{ height: '100px', borderRadius: '8px' }}
          />
        </motion.section>
      </div>
    </motion.div>
  );
}