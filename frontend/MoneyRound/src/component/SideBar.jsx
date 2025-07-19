import "boxicons";
import "../boxicons-master/css/boxicons.css";
import { useRef, useEffect , useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import logo from "./logo2.png";
import "./SlideBar.css";
import useViewport from "../hook/useViewport"; // Nouveau hook custom

function Onglet({ icon, text, isExpanded, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        position: "relative",
        backgroundColor: isActive 
          ? "rgba(255, 255, 255, 0.2)" 
          : isHovered 
            ? "rgba(255, 255, 255, 0.1)" 
            : "transparent",
        margin: "0.25rem 0",
        transition: "background-color 0.3s ease",
        borderRadius: "6px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <i
        className={`bx ${icon}`}
        style={{
          fontSize: "1.2rem",
          minWidth: "24px",
          color: isActive ? "white" : "var(--text-color)",
        }}
      />

      <AnimatePresence>
        {isExpanded ? (
          <motion.span
            style={{
              marginLeft: "1rem",
              whiteSpace: "nowrap",
              color: isActive ? "white" : "var(--text-color)",
              fontWeight: isActive ? "600" : "400",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.span>
        ) : (
          isHovered && (
            <motion.div
              style={{
                position: "absolute",
                left: "50px",
                backgroundColor: "var(--accent-color)",
                padding: "0.5rem 1rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                color: "var(--text-color)",
                borderRadius: "6px",
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {text}
            </motion.div>
          )
        )}
      </AnimatePresence>

      {isActive && (
        <motion.div
          style={{
            position: "absolute",
            right: "8px",
            height: "60%",
            width: "3px",
            backgroundColor: "white",
            borderRadius: "3px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        />
      )}
    </div>
  );
}

Onglet.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

export default function SlideBar({ isExpanded, setIsExpanded }) {
  const { isMobile } = useViewport();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Bloque le scroll quand la sidebar est ouverte en mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isExpanded ? 'hidden' : '';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isExpanded]);

  // Ferme la sidebar quand on change de route en mobile
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [location.pathname, isMobile]);

  const menuItems = [
    { icon: "bx-home", text: "Accueil", path: "/app/home" },
    { icon: "bx-bell", text: "Notifications", path: "/app/notifications" },
    { icon: "bx-grid-alt", text: "Mes Tontines", path: "/app/tontines/list" },
    { icon: "bx-transfer-alt", text: "Transactions", path: "/app/transactions/list" },
    { icon: "bx-cog", text: "Paramètres", path: "/app/settings" },
    { icon: "bx-plus", text: "Créer une Tontine", path: "/app/tontines/create" },
    { icon: "bx-globe", text: "Rejoindre une Tontine", path: "/app/tontines/join" },
    { icon: "bx-credit-card", text: "Dépôt", path: "/app/transactions/deposit" },
    { icon: "bx-money-withdraw", text: "Retrait", path: "/app/transactions/withdraw" },
  ];

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        className="sidebar"
        style={{height: isMobile ? "100vh" : "90vh"}}
        initial={false}
        animate={{
          width: isExpanded ? "230px" : (isMobile ? "0px" : "60px"),
          x: isMobile && !isExpanded ? "-230px" : "0px"
        }}
        transition={{ 
          duration: 0.25,
          ease: [0.33, 1, 0.68, 1] 
        }}
      >
        {/* Header mobile */}
        {isMobile && (
          <div className="sidebar-header">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img src={logo} alt="Logo MoneyRound" className="sidebar-logo" />
              </motion.div>
            )}

            {isMobile && isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="toggle-button"
              >
                <i className="bx bx-x" />
              </button>
            )}
          </div>
        )}

        {/* Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Onglet
              key={item.path}
              icon={item.icon}
              text={item.text}
              isExpanded={isExpanded}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <Onglet
            icon="bx-log-out"
            text="Déconnexion"
            isExpanded={isExpanded}
            isActive={false}
            onClick={() => console.log("Déconnexion")}
          />
        </div>
      </motion.aside>

      {/* Overlay mobile */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

SlideBar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  setIsExpanded: PropTypes.func.isRequired,
};