import '../styles/notification.css'
import Popup from 'reactjs-popup';

import  { useState } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ count = 0, notifications = [] }) => {
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => setShowPanel(!showPanel);

  const notificationList = notifications.map((notification) => (
    <Popup
      key={notification.id}
      trigger={
        <li className={notification.isRead ? 'read' : 'unread'}>
          <img src={notification.avatar} alt="Avatar" />
          <strong>{notification.sender}</strong> {notification.message}
          <a href={notification.link}>{notification.linkText}</a>
          <span className="unread-indicator"></span>
        </li>
      }
    >
      {close => (
        <div>
          <h1>{notification.sender}</h1>

          <button onClick={close}> accepter </button>
          <button onClick={close}> refuser </button>
        </div>
      )}
    </Popup>
  ));

  return (
    <div className="notification">
      <input type="checkbox" id="btn" checked={showPanel} onChange={togglePanel} />
      <input type="checkbox" id="uro" />
      <label htmlFor="btn">
        <span className="counter">{count}</span>
      </label>
      <div className={`${showPanel ? 'panel' :'activ'}`}>
        <div className="unread-only">
          <span>Only show unread</span>
          <label htmlFor="uro">
            <span className="circle"></span>
          </label>
        </div>
        <ul>{notificationList}</ul>
      </div>
    </div>
  );
};
Notification.propTypes = {
  count: PropTypes.number,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      avatar: PropTypes.string,
      sender: PropTypes.string,
      message: PropTypes.string,
      link: PropTypes.string,
      linkText: PropTypes.string,
      isRead: PropTypes.bool,
    })
  ),
};

export default Notification;
