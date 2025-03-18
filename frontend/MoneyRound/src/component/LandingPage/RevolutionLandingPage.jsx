// Importation de Framer Motion
import { motion } from "framer-motion";

// Importation de la feuille de style
import "../../styles/LandingPage/RevolutionLandingPage.css";

// Importation des données
import { allAfter, allBefore } from "../../data";

function RevolutionLandingPage() {
    return (                
        <section className="revolution">
            <div className="box-head-revolution">Revolution</div>
            <div className="first-text"><span>MoneyRound</span> Revolutionizing Your Finances</div>
            <div className="second-text">
                Discover how Budgeta simplifies budgeting, expense tracking, and goal setting, making financial management easier and more efficient.
            </div>

            <div className="before-after">
                {/* Before */}
                <motion.div 
                    className="before"
                    initial={{ x: -200, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    exit={{ x: -200, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                >
                    <div className="head-before-after">
                        Before using MoneyRound
                    </div>
                    
                    <div className="all-content">
                        {allBefore.map((elt, index) => (
                            <div key={index}>
                                <span className="material-icons">sentiment_dissatisfied</span> 
                                {elt}
                            </div>
                        ))}
                    </div>
                </motion.div>
        
                {/* After */}
                <motion.div 
                    className="after"
                    initial={{ x: 200, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    exit={{ x: 200, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                >
                    <div className="head-before-after">
                        After using MoneyRound
                    </div>
                    <div className="all-content">
                        {allAfter.map((elt, index) => (
                            <div key={index}>
                                <span className="material-icons">sentiment_satisfied</span> 
                                {elt}
                            </div>
                        ))} 
                    </div>
                    <button className="classic-btn">
                        Get Started for Free
                    </button>
                </motion.div>  
            </div>
        </section>
    );
}

export default RevolutionLandingPage;
