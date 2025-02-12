// importation de feuille de style
import "../../styles/LandingPage/FeaturesLandingPage.css";

//importation de donnée et autres
import { advantages } from "../../data";
import imgFeature from "../../images/landing-page/bro2.svg";

function FeaturesLandingPage(){
    return(                
    <section className="feature">
        <div className="box-head-feature">Features</div>
        <div className="first-text">Why choose MoneyRound ?</div>
        <div className="second-text">Empowering you to take control of your finances with these top-notch features.</div>
        <div className="all-advantages">
            <div className="see-advantages">
                <div className="first-text">Budjet Tracking</div>
                <div className="second-text">
                    With the Budget Tracking feature, you can create budgets for different spending categories, such as food, transportation, entertainment, and more.
                </div>
                {advantages.map((adv,index)=>(
                    <div className="advantage" key={index}>
                        {adv} 
                    </div>
                ))
                }
            </div>
            <div className="img-advantage">
                <img src={imgFeature} alt="" />
            </div>  
        </div>               
    </section>);
}

export default FeaturesLandingPage