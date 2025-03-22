import { motion } from "framer-motion";
import "../../styles/LandingPage/LetStart.css";
import logoNomSlogan from "../../images/logo/logo en vert avec nom et slogan.svg";

function LetStart() {
  return (
    <section className="lets-start">
      <motion.div
        className="first-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Let’s Start To Keep Your Money Safe
        <div className="all-btn">
          {/* Animation du bouton "Start Here" avec rebond */}
          <motion.button
            className="classic-btn"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          >
            Start Here
          </motion.button>

          {/* Bouton Explore Now */}
          <motion.button
            className="classic-btn"
            style={{ backgroundColor: "transparent" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Now
          </motion.button>
        </div>
      </motion.div>

      {/* Animation du logo */}
      <motion.img
        src={logoNomSlogan}
        alt="Logo"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeIn" }}
      />
    </section>
  );
}

export default LetStart;
