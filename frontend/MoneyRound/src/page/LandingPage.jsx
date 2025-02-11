// importation de feuille de style
import "../styles/general.css";
import "../styles/LandingPage/LandingPage.css";

// importation de composant 
import HeaderLandingPage from "../component/LandingPage/HeaderLandingPage";
import Slider from "../component/LandingPage/Slider";

// importation de hook et autre 
import { advantages } from "../data";
import img1 from "../images/landing-page/bro.svg";
import img2 from "../images/landing-page/bro2.svg";

function LandingPage(){
    return (<>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
        <HeaderLandingPage/>
        <main id="landingPage">
            <Slider></Slider>
            <section className="second-view">
                <section className="presentation">
                    <div className="first-text">Your <span>Money</span> Your <span>Rule</span></div>
                    <div className="second-text">with budgeta,manading your financies has never been easier.Start tracking planning, and achieving your financial goals today</div>
                    <button className="classic-btn">
                        <div>Get Free Now</div> 
                        <span className="material-icons">outbound</span>
                    </button>
                    <img src={img1} alt="" />
                </section>
                <section className="feature">
                    <div className="feature-head">Features</div>
                    <div className="first-text">Why choose MoneyRound ?</div>
                    <div className="second-text">Empowering you to take control of your finances with these top-notch features.</div>
                </section>
                <section className="all-advantages">
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
                        <img src={img2} alt="" />
                    </div>
                    
                </section>
            </section>
        </main>
        
    </>);
}
export default LandingPage