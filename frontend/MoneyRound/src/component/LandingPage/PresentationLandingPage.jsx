// importation de feuille de style
import "../../styles/LandingPage/PresentationLandingPage.css"

//importation d'image
import imgPresentation from "../../images/landing-page/bro.svg";

function PresentationLandingPage(){
    return (<section className="presentation">
        <div className="first-text">Your <span>Money</span> Your <span>Rule</span></div>
        <div className="second-text">with budgeta,manading your financies has never been easier.Start tracking planning, and achieving your financial goals today</div>
        <button className="classic-btn">
            <div>Get Free Now</div> 
            <span className="material-icons">outbound</span>
        </button>
        <img src={imgPresentation} alt="" />
    </section>);
}

export default PresentationLandingPage