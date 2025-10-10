// Create this new file at: components/PageTransitionWrapper.tsx

"use client";

import { useState, useEffect } from 'react';

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const [isAnimationActive, setAnimationActive] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // This effect runs every time the component is mounted (i.e., on page load/navigation)
    setAnimationActive(true);
    setIsOpening(false);

    // Start opening the doors after a short delay
    const openTimer = setTimeout(() => {
        setIsOpening(true);
    }, 500); // A shorter delay for faster page transitions

    // Remove the loading screen from the DOM after the animation completes
    const removeTimer = setTimeout(() => {
        setAnimationActive(false);
    }, 1500); // 500ms wait + 1000ms animation

    // Cleanup timers
    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {isAnimationActive && (
        <div id="loading-screen" className={isOpening ? 'opening' : ''}>
          <div className="door-left door"></div>
          <img src="/XFitnesslogonob.png" className="loading-logo" alt="XFitness Logo" />
          <div className="door-right door"></div>
        </div>
      )}
      {children}
    </>
  );
}