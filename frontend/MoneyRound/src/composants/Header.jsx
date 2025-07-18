import { useState } from 'react';
import { useApi } from '../hook/useApi';
import Notification from './Notifications';
import styles from './Header.module.css';
import { FiMenu, FiX, FiSearch, FiBell } from 'react-icons/fi';
import PropTypes from 'prop-types';
export default function Header({ isExpanded, setIsExpanded }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: user } = useApi('user');

  const notificationData = [
    {
      id: 1,
      sender: "Jean Dupont",
      message: "a demandé à rejoindre votre tontine",
      isRead: false
    }
  ];

  return (
    <header className={styles.header}>
      {/* Partie gauche - Bouton menu */}
      <button 
        className={styles.menuToggle} 
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle menu"
      >
        {isExpanded ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Partie centrale - Barre de recherche */}
      <div className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Partie droite - Notifications + Avatar */}
      <div className={styles.rightSection}>
        <Notification 
          count={notificationData.filter(n => !n.isRead).length} 
          notifications={notificationData} 
          icon={<FiBell className={styles.notificationIcon} />}
        />
        
        {user && (
          <div className={styles.avatar}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.fullName} />
            ) : (
              <div className={styles.initials}>
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  setIsExpanded: PropTypes.func.isRequired,
};