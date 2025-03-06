// importation de feuille de style
import "../../styles/LandingPage/RevolutionLandingPage.css";

//importation des données
import { allAfter,allBefore } from "../../data";

function RevolutionLandingPage(){
    return (                
    <section className="revolution">
        <div className="box-head-revolution">Revolution</div>
        <div className="first-text"><span>MoneyRound</span> Revolutionizing Your Finances</div>
        <div className="second-text">
            Discover how Budgeta simplifies budgeting, expense tracking, and goal setting, making financial management easier and more efficient.
        </div>
        <div className="before-after">
            <div className="before">
                <div className="head-before-after">
                    Before using MoneyRound
                </div>
                
                <div className="all-content">
                    {allBefore.map((elt,index)=>(
                        <div key={index}>
                            <span class="material-icons">sentiment_dissatisfied</span> 
                               {elt}
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="after">
                <div className="head-before-after">
                    After using MoneyRound
                </div>
                <div className="all-content">
                    {allAfter.map((elt,index)=>(
                            <div key={index}>
                                <span className="material-icons">sentiment_satisfied</span> 
                                {elt}
                            </div>
                        ))} 
                </div>
                <button className="classic-btn">
                    Get Started for Free
                </button>
            </div>  

        </div>
    </section>);
}
export default RevolutionLandingPage