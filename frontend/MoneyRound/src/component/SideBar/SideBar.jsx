import { useState } from "react";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { menuItems } from "../data";
import NavItem from "./NavItem";
import { Tooltip } from "react-tooltip";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div         style={{
          background: "var(--background-color)",
          color: "var(--text-color)",
        }} >
      <motion.div
        initial={{ width: 60 }}
        animate={{ width: isOpen ? 240 : 60 }}
        transition={{ duration: 0.4 }}
        // On force ici l'utilisation des variables CSS personnalisées
        className="p-4 flex flex-col gap-6 h-screen bg-[var(--background-color)] text-[var(--text-color)]"
        style={{
          background: "var(--background-color)",
          color: "var(--text-color)",
        }}
      >
        <button
          className="text-xl mb-4"
          style={{ color: "var(--text-color)" }}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <FaBars />
        </button>
        <nav
          className={`flex flex-col gap-11 h-full overflow-y-auto ${
            !isOpen && "no-scrollbar"
          }`}
        >
          {menuItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              text={item.text}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          ))}
        </nav>
      </motion.div>
      {!isOpen && <Tooltip id="sidebar-tooltip" offset={40} />}
    </div>
  );
};

export default Sidebar;