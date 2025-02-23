// Importation de style css
import "../../styles/LandingPage/slide.css";

// Importation hook et autre
import { sliderImages } from "../../data";
import { useEffect, useRef, useState } from "react";

function SliderTest(){
    // Creation de l'index 
    const [indexSlide,setIndexSlide]=useState(0)
    const [indexPrev,setIndexPrev]=useState(3)
    const [indexNext,setIndexNext]=useState(1)
    const allId=[]
    let id=""

    const timer=10000 // 10 secondes avant le changement de slide
    const eltRef=useRef([])

    useEffect(()=>{
        for (let i = 1; i < eltRef.current.length; i++) {
            const element = eltRef.current[i];
            element.style.transform="translateX(-9999px)"
        }
        eltRef.current[0].style.opacity="1"
    },[])

    // fonction pour allez à la slide suivante
    const nextSlide = () => {
        // Calculer les indices
        const nextIndex = (indexSlide + 1) % sliderImages.length;
        
        // Appliquer les animations
        eltRef.current[indexSlide].style.animationName = "current-slide";
        eltRef.current[nextIndex].style.animationName = "next-slide";
    
        // Mettre à jour les états
        setIndexPrev(indexSlide);
        setIndexSlide(nextIndex);
        setIndexNext((nextIndex + 1) % sliderImages.length); // Calculer le prochain index pour la prochaine animation
    };
    const prevSlide = () => {
        // Calculer les indices
        const prevIndex = (indexSlide - 1 + sliderImages.length) % sliderImages.length;
        // Appliquer les animations
        eltRef.current[indexSlide].style.animationName = "current-slide";
        eltRef.current[prevIndex].style.animationName = "next-slide"; // Assurez-vous d'avoir une animation pour le slide précédent
        // Mettre à jour les états
        setIndexPrev(indexSlide);
        setIndexSlide(prevIndex);
        setIndexNext((prevIndex + 1) % sliderImages.length); // Calculer le prochain index pour la prochaine animation
    
    };
    return (
    <section style={{height:"100vh",width:"100%"}}>

    
    <section className="slider" >
        <div className="slider-wrapper">
            {sliderImages.map((image, index) => (                   
                <div className="slider-slide" key={"slide"+index} ref={el=>{eltRef.current[index]=el}}>
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
        <button className="slider-button-next" onClick={nextSlide}>
            <span className="material-icons">arrow_forward_ios</span>
        </button>
        <button className="slider-button-prev">
            <span className="material-icons">arrow_back_ios</span>
        </button>
        {/* Ajout de la pagination */}
        {/* <div className="slider-pagination"></div> */}
    </section>
    </section>);
}
export default SliderTest;