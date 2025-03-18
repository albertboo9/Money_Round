import { motion } from "framer-motion";
import "../../styles/LandingPage/WorkLandingPage.css";

function WorkLandingPage() {
  return (
    <section className="how-work">
      <div className="first-text">How It Works</div>
      <div className="second-text">
        Crypters supports a variety of the most popular digital currencies
      </div>
      <div className="help-start">
        <div className="first-text">
          We Will Help <span>You to Start</span> keep your Money
        </div>
        <button className="classic-btn">Get started</button>
      </div>
      <div className="step">
        {/** Étape 1 */}
        <motion.div
          className="first-step step-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05}}
        >
          <div className="head">
            <div className="icon">
              <span className="material-icons">person</span>
            </div>
            <div className="line"></div>
            <div className="number"><span>1</span></div>
          </div>
          <div className="label">Create an Account</div>
          <div className="content">
            Une étape simple mais primordiale vers une meilleure gestion de votre tontine.
          </div>
          <button className="classic-btn">Create an Account</button>
          <div className="border-animation"></div>
        </motion.div>

        {/** Étape 2 */}
        <motion.div
          className="second-step step-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          whileHover={{ scale: 1.05}}
        >
          <div className="head">
            <div className="icon">
              <span className="material-icons">account_balance</span>
            </div>
            <div className="line"></div>
            <div className="number"><span>2</span></div>
          </div>
          <div className="label">Join a Tontine</div>
          <div className="content">
            Ça y est, vous avez votre compte, maintenant créez une tontine à votre image.
          </div>
          <div className="border-animation"></div>
        </motion.div>

        {/** Étape 3 */}
        <motion.div
          className="third-step step-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          whileHover={{ scale: 1.05}}
        >
          <div className="head">
            <div className="icon">
              <span className="material-icons">trending_up</span>
            </div>
            <div className="line"></div>
            <div className="number"><span>3</span></div>
          </div>
          <div className="label">Keep Money & Be Sure</div>
          <div className="content">
            Déposez vos fonds dans votre compte et votre argent migrera automatiquement dans votre tontine.
          </div>
          <div className="border-animation"></div>
        </motion.div>
      </div>
    </section>
  );
}
export default WorkLandingPage