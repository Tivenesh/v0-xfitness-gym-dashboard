"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      <div className="absolute inset-0 z-0">
        {/* First glowing circle - breathing effect */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.05, 1], // Pulsate scale slightly
            opacity: [0.2, 0.3, 0.2], // Pulsate opacity
            transition: {
              duration: 4, // Duration of one breath cycle
              repeat: Infinity, // Repeat indefinitely
              ease: "easeInOut", // Smooth in and out
            },
          }}
        />
        {/* Second glowing circle - breathing effect */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.1, 1], // Pulsate scale slightly, maybe a bit more than the first
            opacity: [0.1, 0.2, 0.1], // Pulsate opacity
            transition: {
              duration: 5, // Slightly different duration for variety
              repeat: Infinity,
              delay: 1, // Start a bit later than the first
              ease: "easeInOut",
            },
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div className="max-w-5xl mx-auto space-y-8" variants={containerVariants}>
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none"
            variants={itemVariants}
          >
            Premium Equipment.
            <br />
            <span className="text-yellow-400">Unbeatable Vibe.</span>
          </motion.h1>
          <motion.p
            className="text-xl text-white/80 max-w-3xl mx-auto font-medium"
            variants={itemVariants}
          >
            Experience world-class gym facilities designed to elevate your fitness journey.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            variants={itemVariants}
          >
            <a href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-lg px-12 py-6 h-auto bg-transparent"
              >
                Get a Free Day Pass
              </Button>
            </a>
            <a href="#membership">
              <Button
                size="lg"
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-lg px-12 py-6 h-auto"
              >
                Join Now
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}