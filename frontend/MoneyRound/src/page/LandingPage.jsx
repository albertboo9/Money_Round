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
import LetStart from "../component/LandingPage/LetStart";
 
function LandingPage(){
    //Declancher les animations à leur apparition
    document.addEventListener("DOMContentLoaded", () => {
        const allFirstText = document.querySelectorAll('.first-text');
        const allSecondText= document.querySelectorAll('.second-text')
        const observer1 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('come-to-left');
                }
                else{
                    entry.target.classList.remove('come-to-left');
                }
            });
        });
        const observer2 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('come-to-right');
                }
                else{
                    entry.target.classList.remove('come-to-right');
                }
            });
        });    
   // Observer les grand titre
    allFirstText.forEach(element => {
    observer1.observe(element);
        });
    // observer les seconds titre
    allSecondText.forEach(element => {
        observer2.observe(element);
            });
        
    });
    
    
    return (<>
       
        <HeaderLandingPage/>
        <main id="landingPage">
            <Slider></Slider>
            <section className="second-view">
                {/* Ici vous pouvez remarquer que les noms des composant reflete la section ou il sont dans la maquette */} 
                <PresentationLandingPage/>
                <FeaturesLandingPage/>
                <RevolutionLandingPage/>
                <WorkLandingPage/>
                <LetStart/>
            </section>
        </main>
        <Footer/>
        
    </>);
}
export default LandingPage