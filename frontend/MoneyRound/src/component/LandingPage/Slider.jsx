// Importation de style css
import "../../styles/LandingPage/Slider.css";

// Importation hook et autre
import { sliderImages } from "../../data";
import { useEffect, useRef, useState } from "react";

function Slider(){
    // Creation de l'index 
    const [indexSlide,setIndexSlide]=useState(0)
    const [indexPrev,setIndexPrev]=useState(3)
    const [indexNext,setIndexNext]=useState(1)

    const eltRef=useRef([])

    useEffect(()=>{
        for (let i = 1; i < eltRef.current.length; i++) {
            const element = eltRef.current[i];
            element.style.transform="translateX(-9999px)"
        }
        eltRef.current[0].style.opacity="1"
        const btnext=document.querySelector('.slider-button-next')
        const btnprev=document.querySelector('.slider-button-prev')
        
        //survol du boutton suivant
        btnext.addEventListener('mouseover',()=>{
            btnext.style.color="var(--secondary-color)"
            btnprev.style.color="var(--secondary-color)"
        })
        btnext.addEventListener('mouseout',()=>{
            btnext.style.color="transparent"
            btnprev.style.color="transparent"
        })

        //survol du boutton precedent
        btnprev.addEventListener('mouseover',()=>{
            btnext.style.color="var(--secondary-color)"
            btnprev.style.color="var(--secondary-color)"
        })
        btnprev.addEventListener('mouseout',()=>{
            btnext.style.color="transparent"
            btnprev.style.color="transparent"
        })

    },[])


    // fonction pour allez à la slide suivante
    const nextSlide = () => {
        // Calculer les indices
        const nextIndex = (indexSlide + 1) % sliderImages.length;
        
        // Appliquer les animations
        eltRef.current[indexSlide].style.animationName = "current-slide";
        eltRef.current[indexNext].style.animationName = "next-slide";
    
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
        eltRef.current[prevIndex].style.animationName = "prev-slide"; // Assurez-vous d'avoir une animation pour le slide précédent
        // Mettre à jour les états
        setIndexPrev(indexSlide);
        setIndexSlide(prevIndex);
        setIndexNext((prevIndex + 1) % sliderImages.length); // Calculer le prochain index pour la prochaine animation
    
    };

    // Gestion du defilement automatiquement
    const timer=10000 // 10 secondes avant le changement de slide
    const intervalId=setInterval(()=>{
        nextSlide()
        clearInterval(intervalId)
    },timer)
        


    // gestion des boutton pour le changement de slide
    const anySlide = (slideIndex) => {
        if (slideIndex < 0 || slideIndex >= sliderImages.length || slideIndex === indexSlide) {
          return; // Index invalide ou slide déjà affichée
        }
      
        // Appliquer l'animation de sortie à la slide actuelle
        eltRef.current[indexSlide].style.animationName = "current-slide";
      
        // Calculer l'index de la prochaine slide
        const nextIndex = (slideIndex + 1) % sliderImages.length;
      
        // Appliquer l'animation d'entrée à la nouvelle slide
        eltRef.current[slideIndex].style.animationName = "next-slide";
      
        // Mettre à jour les états
        setIndexPrev(indexSlide);
        setIndexSlide(slideIndex);
        setIndexNext(nextIndex);
      };
    return (
    <section className="big-container-slider">

    
    <section className="slider" id="slider" >
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
        <button className="slider-button-prev" onClick={prevSlide}>
            <span className="material-icons">arrow_back_ios</span>
        </button>
        {/* Ajout de la pagination */}
        <div className="slider-pagination">
            {sliderImages.map((image, i) => {
            if (i === indexSlide) {
                return (
                    <nav key={i} className="current-index" onClick={() => anySlide(i)}></nav>
                );
            } else {
                return (
                    <nav key={i} className="other-index" onClick={() => anySlide(i)}></nav>
                );
            }
        })}
        </div>
    </section>
    </section>);
}
export default Slider;