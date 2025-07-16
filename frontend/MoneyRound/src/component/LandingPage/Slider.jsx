import "../../styles/LandingPage/Slider.css";
import { sliderImages } from "../../data";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function Slider() {
  const [indexSlide, setIndexSlide] = useState(0);
  const [indexPrev, setIndexPrev] = useState(sliderImages.length - 1);
  const [indexNext, setIndexNext] = useState(1);
  const eltRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(timer);
  }, [indexSlide]);

  const nextSlide = () => {
    setIndexPrev(indexSlide);
    setIndexSlide((indexSlide + 1) % sliderImages.length);
    setIndexNext((indexSlide + 2) % sliderImages.length);
  };

/*   const prevSlide = () => {
    setIndexPrev(indexSlide);
    setIndexSlide((indexSlide - 1 + sliderImages.length) % sliderImages.length);
    setIndexNext(indexSlide);
  }; */

  return (
    <section className="big-container-slider">
      <section className="slider" id="slider">
        <div className="slider-wrapper">
          {sliderImages.map((image, index) => (
            <motion.div
              key={"slide" + index}
              className="slider-slide"
              ref={(el) => (eltRef.current[index] = el)}
              initial={{ opacity: 0, x: index === indexSlide ? 100 : -100 }}
              animate={{
                opacity: index === indexSlide ? 1 : 0,
                x: index === indexSlide ? 0 : -100,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <img src={image.url} alt="" className="slider-image" />
              <motion.div
                className="info-slider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h2
                  className="title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {image.title}
                </motion.h2>
                 <a href="/create-account" style={{
                  textDecoration: "none", color: "inherit", 
                 }}>
                <motion.p
                  className="caption"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {image.caption}
                </motion.p>
               
                  <motion.button
                    className="classic-btn floating-button"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <div>Get Free Now</div>
                    <span className="material-icons">outbound</span>
                  </motion.button>
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="slider-pagination">
          {sliderImages.map((_, i) => (
            <nav
              key={i}
              className={i === indexSlide ? "current-index" : "other-index"}
              onClick={() => setIndexSlide(i)}
            ></nav>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Slider;
