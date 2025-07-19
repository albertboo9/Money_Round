import { useState, useEffect } from 'react';

const useViewport = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
    };

    // Déclencheur immédiat pour éviter le flash de layout
    handleResize();
    
    // Optimisation avec debounce
    let resizeTimer;
    const resizeListener = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, [isMobile]);

  return { isMobile };
};

export default useViewport;