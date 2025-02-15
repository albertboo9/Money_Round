// importation de feuille de style
import "../styles/general.css";
import "../styles/LandingPage/LandingPage.css";

// importation de composant 
import HeaderLandingPage from "../component/LandingPage/HeaderLandingPage";
import Slider from "../component/LandingPage/Slider";
import PresentationLandingPage from "../component/LandingPage/PresentationLandingPage";
import FeaturesLandingPage from "../component/LandingPage/FeaturesLandingPage";
import RevolutionLandingPage from "../component/LandingPage/RevolutionLandingPage";
import Footer from "../component/Footer/Footer";
import WorkLandingPage from "../component/LandingPage/WorkLandingPage";
function LandingPage(){
    return (<>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
        <HeaderLandingPage/>
        <main id="landingPage">
            <Slider></Slider>
            <section className="second-view">
                {/* Ici vous pouvez remarquer que les noms des composant reflete la section ou il sont dans la maquette  */}
                <PresentationLandingPage/>
                <FeaturesLandingPage/>
                <RevolutionLandingPage/>
                <WorkLandingPage/>
            </section>
        </main>
        <Footer/>
        
    </>);
}
export default LandingPage