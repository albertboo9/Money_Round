import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

export default function Notifications() {
  const [unreadCount, setUnreadCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);

  // Simulation de nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setUnreadCount(prev => Math.min(prev + 1, 9));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <button 
        aria-label="Notifications"
        onClick={() => {
          setIsOpen(!isOpen);
          if (unreadCount > 0) setUnreadCount(0);
        }}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          color: "var(--text-color)",
          position: "relative",
          padding: "0.5rem"
        }}
      >
        <i className="bx bx-bell" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="notification-badge"
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "var(--accent-color)",
              color: "white",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: "bold"
            }}
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              width: "300px",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              padding: "1rem",
              zIndex: 1100
            }}
          >
            {/* Contenu des notifications */}
            <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
              Aucune nouvelle notification
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}