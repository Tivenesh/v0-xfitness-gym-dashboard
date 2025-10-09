// In: components/DotCursor.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function DotCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);

    const interactiveElements = document.querySelectorAll('a, button');
    
    const onMouseEnter = () => setCursorVariant('hover');
    const onMouseLeave = () => setCursorVariant('default');

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 4, // Centered for new 8px size
      y: mousePosition.y - 4,
      height: 8,              // Made smaller
      width: 8,               // Made smaller
      backgroundColor: '#facc15', // Tailwind's yellow-400
      mixBlendMode: 'normal'
    },
    hover: {
      x: mousePosition.x - 16, // Centered for new 32px size
      y: mousePosition.y - 16,
      height: 32,              // Made smaller
      width: 32,               // Made smaller
      backgroundColor: '#ffffff',
      mixBlendMode: 'difference' // This creates the inversion effect
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      variants={variants}
      animate={cursorVariant}
      // MODIFICATION: Increased stiffness and damping for a much faster response
      transition={{ type: 'spring', stiffness: 1000, damping: 50 }}
    />
  );
}