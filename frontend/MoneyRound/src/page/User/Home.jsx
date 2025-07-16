import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import './Home.css';

export default function Home() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });

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
    initial: { 
      opacity: 0.3,
      background: 'linear-gradient(90deg, var(--medium-grey) 25%, var(--small-grey) 50%, var(--medium-grey) 75%)',
      backgroundSize: '200% 100%'
    },
    animate: { 
      opacity: 0.5,
      backgroundPosition: ['0%', '100%', '0%'],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 1.5,
        ease: "linear"
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
      {/* Header avec stats utilisateur */}
      <motion.header className="user-header" variants={itemVariants}>
        <div className="user-greeting">
          <motion.div 
            className="skeleton-circle"
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
          <div className="user-info">
            <motion.div 
              className="skeleton-text" 
              style={{ width: '150px', height: '24px', marginBottom: '8px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div 
              className="skeleton-text" 
              style={{ width: '200px', height: '18px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </div>
        
        <div className="user-stats">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i}
              className="stat-badge"
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              style={{ 
                width: '70px', 
                height: '70px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div 
                className="skeleton-text"
                style={{ width: '30px', height: '16px', marginBottom: '4px' }}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
              />
              <motion.div 
                className="skeleton-text"
                style={{ width: '20px', height: '12px' }}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          ))}
        </div>
      </motion.header>

      {/* Grid Layout */}
      <div className="home-grid">
        {/* Balance Summary */}
        <motion.section className="card balance-card" variants={itemVariants}>
          <div className="balance-header">
            <motion.div 
              className="skeleton-text"
              style={{ width: '40%', height: '24px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
          </div>
          <div className="balance-values">
            <div className="balance-main">
              <motion.div 
                className="skeleton-text"
                style={{ width: '60%', height: '18px', marginBottom: '8px' }}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
              />
              <motion.div 
                className="skeleton-text"
                style={{ width: '80%', height: '40px', borderRadius: '8px' }}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className="balance-secondary">
              <motion.div 
                className="skeleton-text"
                style={{ width: '60%', height: '16px', marginBottom: '8px' }}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
              />
              <motion.div 
                className="skeleton-text"
                style={{ width: '70%', height: '30px', borderRadius: '8px' }}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>
        </motion.section>

        {/* Active Tontines */}
        <motion.section className="card tontines-card" variants={itemVariants}>
          <div className="card-header">
            <motion.div 
              className="skeleton-text"
              style={{ width: '40%', height: '24px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div 
              className="skeleton-text"
              style={{ width: '80px', height: '20px', borderRadius: '20px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
          </div>
          
          <div className="tontines-grid">
            {[...Array(isMobile ? 1 : isTablet ? 2 : 3)].map((_, i) => (
              <motion.div 
                key={i}
                className="tontine-skeleton"
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                style={{ 
                  height: '180px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px'
                }}
              >
                <motion.div 
                  style={{ width: '70%', height: '20px', marginBottom: '16px' }}
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                />
                <motion.div 
                  style={{ 
                    width: '100%', 
                    height: '8px', 
                    borderRadius: '4px',
                    marginBottom: '24px'
                  }}
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <motion.div 
                    style={{ width: '40%', height: '16px' }}
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.div 
                    style={{ width: '40%', height: '16px' }}
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                  />
                </div>
                <motion.div 
                  style={{ 
                    width: '100%', 
                    height: '1px', 
                    backgroundColor: 'var(--medium-grey)',
                    margin: '16px 0'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <motion.div 
                    style={{ width: '30%', height: '14px' }}
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.div 
                    style={{ width: '30%', height: '14px' }}
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recent Transactions */}
        <motion.section className="card transactions-card" variants={itemVariants}>
          <div className="card-header">
            <motion.div 
              className="skeleton-text"
              style={{ width: '40%', height: '24px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div 
              className="skeleton-text"
              style={{ width: '80px', height: '20px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
          </div>
          <div className="transactions-list">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                className="transaction-item"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--medium-grey)'
                }}
              >
                <motion.div 
                  style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '12px'
                  }}
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                />
                <div style={{ flex: 1 }}>
                  <motion.div 
                    style={{ 
                      width: '60%', 
                      height: '16px',
                      marginBottom: '6px'
                    }}
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.div 
                    style={{ 
                      width: '40%', 
                      height: '14px'
                    }}
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                  />
                </div>
                <motion.div 
                  style={{ 
                    width: '70px',
                    height: '24px',
                    borderRadius: '12px'
                  }}
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section className="card actions-card" variants={itemVariants}>
          <div className="card-header">
            <motion.div 
              className="skeleton-text"
              style={{ width: '40%', height: '24px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
          </div>
          <div className="actions-grid">
            {['Créer', 'Rejoindre', 'Dépôt', 'Retrait', 'Inviter', 'Historique'].map((action) => (
              <motion.div 
                key={action}
                className="action-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <motion.div 
                  style={{ 
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%'
                  }}
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                />
                <motion.div 
                  style={{ 
                    width: '60px',
                    height: '16px',
                    borderRadius: '4px'
                  }}
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Next Payment */}
        <motion.section className="card payment-card" variants={itemVariants}>
          <div className="card-header">
            <motion.div 
              className="skeleton-text"
              style={{ width: '40%', height: '24px' }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            />
          </div>
          <div className="payment-content">
            <motion.div 
              style={{ 
                width: '100%',
                height: '80px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px'
              }}
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <motion.div 
                  style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                  }}
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                />
                <div>
                  <motion.div 
                    style={{ 
                      width: '100px',
                      height: '16px',
                      marginBottom: '6px'
                    }}
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.div 
                    style={{ 
                      width: '80px',
                      height: '14px'
                    }}
                    variants={skeletonVariants}
                    initial="initial"
                    animate="animate"
                  />
                </div>
              </div>
              <motion.div 
                style={{ 
                  width: '80px',
                  height: '30px',
                  borderRadius: '15px'
                }}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}