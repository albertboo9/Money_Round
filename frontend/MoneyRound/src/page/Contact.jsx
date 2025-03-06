// importation de feuille de style
import "../styles/general.css";
import "../styles/LandingPage/Contact.css";

// importation de composant 
import HeaderLandingPage from "../component/LandingPage/HeaderLandingPage";
import InfoForm from "../component/Contact/InfoForm";
function Contact() {
    return (<>
    <HeaderLandingPage/>
    <main id="contactPage">
        <section className="second-view">
            {/* Ici vous pouvez remarquer que les noms des composant reflete la section ou il sont dans la maquette */} 
            <section className="title-contact">
                <div className="small-title">Contact-Us</div>
                <div className="big-title">Send a message</div>
            </section>
            <InfoForm/>
        </section>
    </main>
    <Footer/>
    </>)
}

export default Contact