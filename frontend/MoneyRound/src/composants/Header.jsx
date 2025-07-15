import { useState } from 'react';
import Notification from './Notifications';
import SearchBar from './SearchBar';
import LetterAvatars from './Avatar';
import PropTypes from 'prop-types'

export default function Header({isExpanded, setIsExpanded}) {
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
    <header className="main-header" >
      <div className="header-left">
        <button className="menu-toggle" onClick={() => setIsExpanded(!isExpanded)}>
          <i className={`bx ${isExpanded ? "bx-x" : "bx-menu"}`}></i>
        </button>
      </div>

      <div className="header-center" >
        <SearchBar 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap:2}}>
       
        <Notification 
          count={3} 
          notifications={notificationData} 
        />
         <LetterAvatars />
      </div>
    </header>
  );
}

Header.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  setIsExpanded: PropTypes.func.isRequired,
};