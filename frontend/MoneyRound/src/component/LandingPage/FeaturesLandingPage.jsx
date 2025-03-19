import { motion } from "framer-motion";
import "../../styles/LandingPage/FeaturesLandingPage.css";
import { advantages } from "../../data";
import imgFeature from "../../images/landing-page/bro2.svg";

function FeaturesLandingPage() {
  return (
    <section className="feature">
      {/* Animation du titre "Features" */}
      <motion.div
        className="box-head-feature"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Features
      </motion.div>

      {/* Animation des sous-titres */}
      <motion.div
        className="first-text"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        Why choose MoneyRound ?
      </motion.div>

      <motion.div
        className="second-text"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      >
        Empowering you to take control of your finances with these top-notch features.
      </motion.div>

      <div className="all-advantages">
        <motion.div
          className="see-advantages"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="first-text">Budget Tracking</div>
          <div className="second-text">
            With the Budget Tracking feature, you can create budgets for different spending categories, such as food, transportation, entertainment, and more.
          </div>
          {advantages.map((adv, index) => (
            <motion.div
              className="advantage"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
            >
              {adv}
            </motion.div>
          ))}
        </motion.div>

        {/* Animation de l'image qui entre et sort vers la droite */}
        <motion.div
          className="img-advantage"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img src={imgFeature} alt="" />
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesLandingPage;
