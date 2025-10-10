"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function WhatsAppButton() {
  const phoneNumber = "601172603394";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      // Removed the green background color and adjusted shadow for visibility
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-transparent text-white shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.1, filter: "drop-shadow(0px 0px 15px #25D366)" }} // Using filter for a glow effect
      whileTap={{ scale: 0.95 }}
    >
      <Image
        src="/whatsapplogo.png"
        alt="WhatsApp"
        width={64}
        height={64}
        className="object-cover"
      />
    </motion.a>
  );
}