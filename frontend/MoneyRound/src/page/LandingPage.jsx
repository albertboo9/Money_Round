import { motion, useScroll, useTransform } from "framer-motion";
import "../styles/general.css";
import "../styles/LandingPage/LandingPage.css";

// Importation des composants
import HeaderLandingPage from "../component/LandingPage/HeaderLandingPage";
import Slider from "../component/LandingPage/Slider";
import PresentationLandingPage from "../component/LandingPage/PresentationLandingPage";
import FeaturesLandingPage from "../component/LandingPage/FeaturesLandingPage";
import RevolutionLandingPage from "../component/LandingPage/RevolutionLandingPage";
import Footer from "../component/Footer/Footer";
import WorkLandingPage from "../component/LandingPage/WorkLandingPage";
import LetStart from "../component/LandingPage/LetStart";

function LandingPage() {
  // Effet de parallaxe basé sur le scroll
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]); // Effet de zoom progressif

  return (
    <>
      <HeaderLandingPage />

      <main id="landingPage">
          <Slider />

        <section className="second-view">
          {/* Animation des Titres */}
          <motion.h2
            className="first-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.8 } }}
            viewport={{ once: false, amount: 0.2 }}
          >
            Bienvenue sur notre plateforme
          </motion.h2>

          <motion.h3
            className="second-text"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }}
            exit={{ opacity: 0, x: 50, transition: { duration: 0.8 } }}
            viewport={{ once: false, amount: 0.2 }}
          >
            Découvrez nos fonctionnalités
          </motion.h3>

          {/* Animation des Sections */}
          {[PresentationLandingPage, FeaturesLandingPage, RevolutionLandingPage, WorkLandingPage, LetStart].map((Component, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
              exit={{ opacity: 0, y: 50, transition: { duration: 0.8 } }}
              viewport={{ once: false, amount: 0.2 }}
            >
              <Component />
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default LandingPage;
