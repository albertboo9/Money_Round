import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const Notification = ({ count = 0, notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(count);

  useEffect(() => {
    setUnreadCount(count);
  }, [count]);

  const markAsRead = () => {
    setIsOpen(false);
    setUnreadCount(0);
  };

  return (
    <div className="notification-wrapper">
      <motion.button
        className="notification-button"
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bx bx-bell"></i>
        {unreadCount > 0 && (
          <motion.span 
            className="notification-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="panel-header">
              <h3>Notifications</h3>
              <button onClick={markAsRead}>Marquer comme lues</button>
            </div>
            
            <ul className="notification-list">
              {notifications.map(notification => (
                <motion.li
                  key={notification.id}
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                >
                  <div className="notification-content">
                    <strong>{notification.sender}</strong> {notification.message}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Notification.propTypes = {
  count: PropTypes.number,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      sender: PropTypes.string,
      message: PropTypes.string,
      isRead: PropTypes.bool,
    })
  ),
};

export default Notification;