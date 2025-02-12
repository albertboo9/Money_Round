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
            <div className="all-before">
                {allBefore.map((elt,index)=>(
                    <div key={index}>
                        <span className="material-icons">sentiment dissatified</span> 
                        {elt}
                    </div>
                ))}
            </div>
            <div className="all-after">
            {allAfter.map((elt,index)=>(
                    <div key={index}>
                        <span className="material-icons">sentiment satified</span> 
                        {elt}
                    </div>
                ))}                            
            </div>
        </div>
    </section>);
}
export default RevolutionLandingPage