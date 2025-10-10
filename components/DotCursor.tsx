"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation'; // Import the hook to detect page changes

export function DotCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const pathname = usePathname(); // This variable will update whenever the page URL changes

  // This effect runs only ONCE to track the mouse position globally
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  // This effect runs EVERY TIME the page (pathname) changes
  useEffect(() => {
    const onMouseEnter = () => setCursorVariant('hover');
    const onMouseLeave = () => setCursorVariant('default');

    const interactiveElements = document.querySelectorAll('a, button');
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    // This cleanup function is crucial: it removes old listeners before adding new ones
    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, [pathname]); // The key change: this effect re-runs when the pathname changes

  const variants = {
    default: {
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      height: 8,
      width: 8,
      backgroundColor: '#facc15', // Tailwind's yellow-400
      mixBlendMode: 'normal'
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: '#ffffff',
      mixBlendMode: 'difference' // This creates the inversion effect
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      variants={variants}
      animate={cursorVariant}
      transition={{ type: 'spring', stiffness: 3000, damping: 80 }}
    />
  );
}