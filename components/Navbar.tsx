"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
   { href: "/login", label: "Admin" },
  { href: "/#features", label: "Features" },
  { href: "/#app", label: "App" },
  { href: "/#membership", label: "Membership" },
  { href: "/#locations", label: "Location" },
  { href: "/#about", label: "About" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (sectionId.startsWith('/#')) {
        e.preventDefault();
        const elementId = sectionId.substring(2);
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    toggleMenu();
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-yellow-400"
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
             <motion.div
                className="transform-origin-left"
                animate={{ scale: isHeaderHovered ? 1.5 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
             >
                <Image 
                    src="/XFitnesslogonob.png" 
                    alt="XFitness Logo" 
                    width={160}
                    height={52}
                    className="h-16 w-auto"
                />
             </motion.div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <a href="/download">
                <Button className="bg-yellow-400 text-black rounded-md hover:bg-yellow-500 font-black uppercase px-6 h-10 text-sm shadow-[0_0_15px_rgba(252,211,77,0.3)] transition-shadow">
                    Download App
                </Button>
            </a>
            <button
              onClick={toggleMenu}
              className="font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors text-white/80 hover:text-yellow-400"
            >
              <span>Menu</span>
              <Menu size={20} />
            </button>
          </div>

          <div className="lg:hidden">
            <button onClick={toggleMenu} className="text-white p-2">
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-[100] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-end items-center h-[88px]">
                 <button
                    onClick={toggleMenu}
                    className="font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors text-white/80 hover:text-yellow-400"
                >
                    <span>Close</span>
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">
              <motion.div 
                className="hidden lg:flex items-center justify-center bg-white"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                <div className="text-center">
                    <motion.div
                        className="mb-4"
                        animate={{ 
                            scale: [1, 1.05, 1], 
                            filter: ['drop-shadow(0 0 20px rgba(252,211,77,0.5))', 'drop-shadow(0 0 30px rgba(252,211,77,0.8))', 'drop-shadow(0 0 20px rgba(252,211,77,0.5))'] 
                        }}
                        transition={{ 
                            duration: 3, 
                            ease: "easeInOut", 
                            repeat: Infinity, 
                            repeatType: "reverse" 
                        }}
                    >
                        <Image 
                            src="/XFitnesslogo_whitebackground.jpg"
                            alt="XFitness Logo" 
                            width={250} 
                            height={100}
                            className="mx-auto"
                        />
                    </motion.div>
                    <p className="text-xl text-black/70 font-medium mt-4">
                        Premium Equipment. <br/> Unbeatable Vibe.
                    </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col justify-center items-center lg:items-start p-8 lg:p-24"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 }}
                }}
              >
                <nav className="flex flex-col items-center lg:items-start gap-6">
                  {navLinks.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider origin-left"
                      variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ scale: 1.05, color: 'hsl(var(--primary))' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}