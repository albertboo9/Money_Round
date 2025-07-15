import 'boxicons'
import '../boxicons-master/css/boxicons.css'
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import logo from "./logo2.png";
import './SlideBar.css';

// ... (Onglet component remains unchanged)
function Onglet({ icon, text, isExpanded, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        position: "relative",
        backgroundColor: isHovered ? "rgba(255, 255, 255, 0.1)" : "transparent",
        margin: "0.25rem 0",
        transition: "background-color 0.4s",
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
          color: "var(--text-color)",
        }}
      />
      
      <AnimatePresence>
        {isExpanded ? (
          <motion.span
            style={{
              marginLeft: "1rem",
              whiteSpace: "nowrap",
              color: "var(--text-color)",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
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
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {text}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}

Onglet.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};
// End of Onglet component

export default function SlideBar({isExpanded, setIsExpanded}) {
  const [isMobile, setIsMobile] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0); // Nouveau state pour la hauteur du header
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Détecter la hauteur du header pour positionner la sidebar
  useEffect(() => {
    const headerElement = document.querySelector('.main-header'); // Assurez-vous que votre header a cette classe
    if (headerElement) {
      setHeaderHeight(headerElement.offsetHeight);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight); // Mettre à jour si la hauteur du header change (ex: responsive)
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Exécute une seule fois au montage pour la hauteur initiale, et gère les redimensionnements

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Pour le mode mobile, si l'overlay est visible, il gère déjà le clic-outside.
      // Pour le mode desktop, on veut que le clic en dehors de la sidebar la ferme,
      // SAUF si le clic provient du bouton toggle du header.
      
      const headerToggleButton = document.querySelector('.menu-toggle'); 

      if (
        isExpanded && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) && // Clic en dehors de la sidebar
        (!headerToggleButton || !headerToggleButton.contains(event.target)) // ET pas sur le bouton toggle du header
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, setIsExpanded]);

  const menuItems = [
    { icon: "bx-home", text: "Accueil", path: "/" },
    { icon: "bx-bell", text: "Notifications", path: "/notifications" },
    { icon: "bx-grid-alt", text: "Mes Tontines", path: "/tontines" },
    { icon: "bx-wallet", text: "Mon Solde", path: "/solde" },
    { icon: "bx-transfer-alt", text: "Transactions", path: "/transactions" },
    { icon: "bx-cog", text: "Paramètres", path: "/parametres" },
    { icon: "bx-plus", text: "Créer une Tontine", path: "/creer-tontine" },
    { icon: "bx-globe", text: "Rejoindre une Tontine", path: "/rejoindre" },
  ];

  return (
    <div style={{ display: "flex", height: "80vh", backgroundColor: "var(--background-color)" }}>


      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        style={{
          background: "var(--accent-color)",
          color: "var(--text-color)",
          // Ajustements ici pour la hauteur et le positionnement en desktop
          height: isMobile ? "100vh" : `calc(100vh - ${headerHeight}px)`, // Occupe la hauteur restante
          position: isMobile ? "fixed" : "sticky",
          top: isMobile ? 0 : headerHeight, // Commence sous le header en desktop
          left: 0,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1000,
        }}
        animate={{
          width: isExpanded ? "230px" : isMobile ? "0px" : "60px",
          x: isMobile && !isExpanded ? -230 : 0
        }}
        transition={{ duration: 0.4, ease: "easeInOut"}}
      >
        {/* Contenu du header de la sidebar, visible UNIQUEMENT en mode mobile */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isExpanded ? "space-between" : "flex-end", // Pas besoin de centrer en mobile quand non expanded
              padding: "1rem",
              marginBottom: "1rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              minHeight: "60px" 
            }}
          >
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={logo}
                  alt="Logo MoneyRound"
                  style={{ width: "40px", height: "40px", display: "block" }}
                />
              </motion.div>
            )}
            
            {/* Bouton de FERMETURE pour mobile (visible si sidebar ouverte) */}
            {isMobile && isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: "none", border: "none", color: "var(--text-color)",
                  cursor: "pointer", fontSize: "1.5rem", padding: "0.5rem",
                  transition: "background-color 0.3s",
                }}
              >
                <i className="bx bx-x" />
              </button>
            )}
          </div>
        )}
        
        {/* Menu (toujours présent) */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0.2rem" }}>
          {menuItems.map((item) => (
            <Onglet
              key={item.path}
              icon={item.icon}
              text={item.text}
              isExpanded={isExpanded}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setIsExpanded(false);
              }}
            />
          ))}
        </nav>

        {/* Footer (Déconnexion) */}
        <div style={{ padding: "0.2rem", borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}>
          <Onglet
            icon="bx-log-out"
            text="Déconnexion"
            isExpanded={isExpanded}
            onClick={() => {
                console.log("Déconnexion");
                if (isMobile) setIsExpanded(false);
            }}
          />
        </div>
      </motion.aside>

      {/* Overlay mobile */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              zIndex: 999,
              pointerEvents: "auto",
            }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
          <div style={{ 
      flex: 1,
      marginLeft: isMobile ? 0 : (isExpanded ? "230px" : "60px"),
      transition: "margin-left 0.3s ease",
      // Ajustement de la hauteur du contenu principal pour éviter la scrollbar
      minHeight: `calc(100vh - ${headerHeight}px)`, 
      marginTop: isMobile ? 0 : headerHeight // Le contenu commence sous le header
    }}>
      {/* Ici le contenu principal de la page, par exemple votre <Outlet /> */}
      </div>
    </div>
  );
}

SlideBar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  setIsExpanded: PropTypes.func.isRequired,
};