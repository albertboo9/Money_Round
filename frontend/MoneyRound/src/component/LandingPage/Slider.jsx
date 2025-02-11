// Slider.js
import 'swiper/swiper-bundle.css';
import Swiper from 'swiper/bundle';
import "../../styles/LandingPage/Slider.css";
// importation de hook et autre
import { useEffect} from "react";
import slide1 from "../../images/slider/slide1.webp";
import slide2 from "../../images/slider/slide2.webp";
import slide3 from "../../images/slider/slide3.webp";
import slide4 from "../../images/slider/slider4.webp";

function Slider() {
    // Ensembles des URL des images du slider
    const sliderImages = [
        {
            url:slide1,
            title: "A ton Tour de Bouffer avec Money Round",
            caption:"Nous faire confiance c’est prendre soin de votre avenir"
        },
        {
            url: slide2,
            title: "Que Tu sois eleve ou travailleur",
            caption:"Nous avons la formule pour tous, viens trouve ton bonheur et construis ton avenir."
        },
        {
            url: slide3,
            title: "Profites de tes epargnes",
            caption:"Grace a notre systeme nous assurons une gestion miticuleuse de votre argent."
        },
        {
            url: slide4,
            title: "Avec Money Round, Bouffer deviens une evidence.",
            caption:"On ne se prends plus la tete avec un systeme alcaique quand Money Round est la."
        }
    ];
    // creation du slider 
    //Utilisation de la bibliothèque slider
    useEffect(() => {
        const swiper = new Swiper('.swiper', {
            direction: 'horizontal',
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 10000, // Délai de 10 secondes
                disableOnInteraction: false, // Ne pas désactiver l'autoplay après interaction
            },
        });

        // la classe slider n'etant plus nécessaire on la supprime du cache
        return () => {
            swiper.destroy();
        };
    }, []);

    return (
        <div className="swiper">
            <div className="swiper-wrapper">
                {sliderImages.map((image, index) => (                   
                    <div className="swiper-slide" key={index} style={{ backgroundImage: "url("+image.url+")" }}>
                        {/* Creation de chaque page du slider */}
                        <img src={image.url} alt="" />
                        <div className='info-slider'> 
                            <nav className="title">{image.title}</nav>
                            <nav className="caption">{image.caption}</nav>
                            <button className="classic-btn">
                                <div>Get Free Now</div> 
                                <span className="material-icons">outbound</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {/* Ajout des boutons de navigation */}
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
            {/* Ajout de la pagination */}
            <div className="swiper-pagination"></div>
        </div>
    );
};

export default Slider;