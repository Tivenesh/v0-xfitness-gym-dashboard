"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#app", label: "App" },
  { href: "/#membership", label: "Membership" },
  { href: "/#locations", label: "Location" },
  { href: "/#about", label: "About" },
];

export function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[90] md:hidden"
      />

      {/* Sidebar Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-black z-[100] p-6 shadow-2xl shadow-yellow-400/20 md:hidden"
      >
        {/* Header with Close Button */}
        <div className="flex justify-end mb-10">
          <button onClick={onClose} className="text-white/70 hover:text-yellow-400 transition-colors">
            <X className="h-8 w-8" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex flex-col h-full">
            {/* Download Button at the top */}
            <Link href="/download" passHref>
                <Button 
                    onClick={onClose}
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-black uppercase text-lg py-6 mb-10"
                >
                    Download App
                </Button>
            </Link>

            {/* Navigation Links */}
            <ul className="flex flex-col items-start space-y-6">
            {navLinks.map((link) => (
                <li key={link.label}>
                <a 
                    href={link.href} 
                    onClick={onClose} 
                    className="text-2xl font-black text-white uppercase tracking-wider hover:text-yellow-400 transition-colors"
                >
                    {link.label}
                </a>
                </li>
            ))}
            </ul>
        </div>
      </motion.div>
    </>
  );
}
