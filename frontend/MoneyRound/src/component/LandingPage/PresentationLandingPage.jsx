import { motion } from "framer-motion";
import "../../styles/LandingPage/PresentationLandingPage.css";
import imgPresentation from "../../images/landing-page/bro.svg";

function PresentationLandingPage() {
  return (
    <section className="presentation">
      {/* Animation du premier texte */}
      <motion.div
        className="first-text"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Your <span>Money</span> Your <span>Rule</span>
      </motion.div>

      {/* Animation du deuxième texte */}
      <motion.div
        className="second-text"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        With Budgeta, managing your finances has never been easier. Start tracking, planning, and achieving your financial goals today.
      </motion.div>

      {/* Animation du bouton */}
      <motion.button
        className="classic-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div>Get Free Now</div>
        <span className="material-icons">outbound</span>
      </motion.button>

      {/* Animation de l'image */}
      <motion.img
        src={imgPresentation}
        alt="Presentation Image"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </section>
  );
}

export default PresentationLandingPage;
