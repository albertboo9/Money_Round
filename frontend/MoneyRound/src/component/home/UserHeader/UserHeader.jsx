import { useApi } from '../../../hook/useApi';
import SkeletonHeader from './SkeletonHeader';
import styles from './styles.module.css';
import { motion } from 'framer-motion';
import { 
  FiAward, 
  FiTrendingUp, 
  FiBarChart2,
  FiUser,
  FiCheckCircle,
  FiStar,
  FiSun
} from 'react-icons/fi';
import PropTypes from 'prop-types';

const StatBadge = ({ icon, value, label, color }) => (
  <motion.div 
    className={styles.statBadge}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', delay: 0.3 }}
  >
    <div className={`${styles.badgeCircle} ${styles[color]}`}>
      {icon}
    </div>
    <div className={styles.badgeContent}>
      <div className={styles.badgeValue}>{value}</div>
      <span className={styles.badgeLabel}>{label}</span>
    </div>
  </motion.div>
);
StatBadge.propTypes = {
  icon: PropTypes.element.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const UserHeader = () => {
  const { data, loading, error } = useApi('user');

  if (loading) return <SkeletonHeader />;
  if (error) return <SkeletonHeader />;

  const getReputationData = () => {
    switch(data.reputation) {
      case 'VIP': 
        return { 
          icon: <FiStar className={styles.repIcon} />,
          color: 'gold',
          bgColor: 'rgba(245, 158, 11, 0.08)',
          welcome: 'Superstar de la communauté !'
        };
      case 'Fiable': 
        return { 
          icon: <FiCheckCircle className={styles.repIcon} />,
          color: 'green',
          bgColor: 'rgba(16, 185, 129, 0.08)',
          welcome: 'Membre exemplaire !'
        };
      default: 
        return { 
          icon: <FiUser className={styles.repIcon} />,
          color: 'blue',
          bgColor: 'rgba(59, 130, 246, 0.08)',
          welcome: 'Bienvenue dans votre espace !'
        };
    }
  };

  const repData = getReputationData();

  return (
    <header className={styles.header}>
      <div className={styles.headerBackground} />
      
      <div className={styles.headerContent}>
        <div className={styles.profileSection}>
          <motion.div 
            className={styles.avatarContainer}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
          >
            <div className={styles.avatar}>
              {data.profilePicture ? (
                <img src={data.profilePicture} alt={data.fullName} />
              ) : (
                <div className={styles.initials}>
                  {data.fullName.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div className={`${styles.reputationBadge} ${styles[repData.color]}`}>
              {repData.icon}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.profileInfo}
          >
            <div className={styles.welcomeContainer}>
              <FiSun className={styles.welcomeIcon} />
              <h2>Bonjour, <span>{data.fullName}</span></h2>
            </div>
            <p className={styles.welcomeMessage}>{repData.welcome}</p>
          </motion.div>
        </div>
        
        <div className={styles.statsContainer}>
          <StatBadge 
            icon={<FiAward className={styles.statIcon} />}
            value={`#${data.ranking}`}
            label="Votre classement"
            color="primary"
          />
          <StatBadge 
            icon={<FiTrendingUp className={styles.statIcon} />}
            value={data.score}
            label="Score d'activité"
            color="secondary"
          />
          <StatBadge 
            icon={<FiBarChart2 className={styles.statIcon} />}
            value={data.evaluations?.average?.toFixed(1) || '0.0'}
            label="Note moyenne"
            color={repData.color}
          />
        </div>
      </div>
    </header>
  );
};

export default UserHeader;