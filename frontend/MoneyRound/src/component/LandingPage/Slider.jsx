import "../../styles/LandingPage/Slider.css";
import { sliderImages } from "../../data";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

function Slider() {
  const [indexSlide, setIndexSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const timerRef = useRef(null);

  // Auto-advance slides
  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [indexSlide, isHovered]);

  const nextSlide = () => {
    setDirection(1);
    setIndexSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndexSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const goToSlide = (index) => {
    setDirection(index > indexSlide ? 1 : -1);
    setIndexSlide(index);
  };

  // Animation variants
  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" }
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section 
      className="slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="slider-wrapper">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={indexSlide}
            className="slider-slide"
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <img 
              src={sliderImages[indexSlide].url} 
              alt={sliderImages[indexSlide].title} 
              className="slider-image" 
              loading="lazy"
            />
            
            <motion.div 
              className="slider-content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 className="slider-title" variants={itemVariants}>
                {sliderImages[indexSlide].title}
              </motion.h2>
              
              <motion.p className="slider-caption" variants={itemVariants}>
                {sliderImages[indexSlide].caption}
              </motion.p>
              
              <motion.a 
                href="/create-account" 
                className="slider-button"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  Get Free Now
                  <span className="material-icons">arrow_right_alt</span>
                </motion.span>
              </motion.a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {!isMobile && (
          <>
            <button className="slider-nav prev" onClick={prevSlide} aria-label="Previous slide">
              <span className="material-icons">chevron_left</span>
            </button>
            <button className="slider-nav next" onClick={nextSlide} aria-label="Next slide">
              <span className="material-icons">chevron_right</span>
            </button>
          </>
        )}

        <div className="slider-pagination">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              className={`slider-dot ${i === indexSlide ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Slider;