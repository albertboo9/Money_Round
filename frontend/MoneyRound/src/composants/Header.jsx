import { useState } from 'react';
import { motion } from 'framer-motion';
import Notification from './Notifications';
import SearchBar from './SearchBar';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  

  // Données de démonstration pour les notifications
  const notificationData = [
    {
      id: 1,
      sender: "Jean Dupont",
      message: "a demandé à rejoindre votre tontine",
      isRead: false
    }
  ];


  return (
    <header className="main-header">
      <div className="header-left">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="menu-button"
          aria-label="Menu"
         style={{visibility:"hidden"}}
        >
          <i className="bx bx-menu"></i>
        </motion.button>
      </div>

      <div className="header-center">
        <SearchBar 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-right">
        <Notification 
          count={3} 
          notifications={notificationData} 
        />
      </div>
    </header>
  );
}