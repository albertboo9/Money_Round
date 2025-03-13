// importation de feuille de style
import "../styles/general.css";
import "../styles/Contact/Contact.css";

// importation de composant 
import HeaderLandingPage from "../component/LandingPage/HeaderLandingPage";
import InfoForm from "../component/Contact/InfoForm";
import Footer from "../component/Footer/Footer";
import MapComponent from "../component/Contact/Map";
function Contact() {
    return (<>
    <HeaderLandingPage/>
    <main id="contactPage">
        <section className="second-view">
            {/* Ici vous pouvez remarquer que les noms des composant reflete la section ou il sont dans la maquette */} 
            <section className="title-contact">
                <div className="second-text">Contact-Us</div>
                <div className="first-text">Send a message</div>
            </section>
            <InfoForm/>
        </section>
        <MapComponent/>
    </main>
    <Footer/>
    </>)
}

export default Contact