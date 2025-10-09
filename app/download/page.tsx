"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScanFace, CreditCard, Megaphone, Wifi, BatteryCharging, type LucideProps } from "lucide-react";
import React from "react";

// Animation variants for letter-by-letter stagger effect
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

// Helper component to apply animation to a string of text
const AnimatedLetters = ({ text }: { text: string }) => {
  const letters = Array.from(text);
  return (
    <motion.span
      className="inline-block"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

// SVG icon for the Apple logo
const AppleLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.1 0 183.2 0 245.4c0 45.7 30.1 73.2 62.1 73.2 33.1 0 55.7-23.7 87.2-23.7 31.5 0 56.4 23.7 87.2 23.7 33.1 0 62.1-27.5 62.1-73.2 0-.2 0-.3 0-.5zM224 439c-24.3 0-41.3-15.7-56.8-15.7-15.5 0-32.8 15.7-56.8 15.7-24.3 0-42.5-15.7-57.3-15.7-14.8 0-32.3 15.7-56.3 15.7-2.3 0-10.3-48.4 8.2-101.4 22.8-63.4 55.7-97.4 92.2-97.4 35.5 0 54.1 23.7 83.2 23.7 28.1 0 51.4-23.7 83.2-23.7 37.5 0 70.8 33.9 92.2 97.4 18.5 53 10.5 101.4 8.2 101.4-24 0-41.8-15.7-56.3-15.7-15.5 0-33.3 15.7-57.3 15.7z" />
    </svg>
);

// SVG icon for the Google Play logo
const GooglePlayLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 512 512" fill="currentColor" {...props}>
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0L112 32l-65 65-32-32L47 0zm0 480l65 32-32-32-65 65zM104.6 499l220.7-221.2-60.1-60.1L104.6 499zM411.2 161.2L130.4 0l60.1 60.1L411.2 161.2z" />
    </svg>
);

const featureCards = [
    {
        icon: ScanFace,
        title: "Seamless Gym Access",
        description: "No more cards or fobs. Your face is your key. Our app integrates with facial recognition for instant, secure entry."
    },
    {
        icon: CreditCard,
        title: "Manage Membership",
        description: "Purchase, renew, and track your membership plan directly from your phone. View payment history anytime, anywhere."
    },
    {
        icon: Megaphone,
        title: "Stay Updated",
        description: "Never miss out. Get instant notifications for special promotions, Hari Raya offers, and important gym announcements."
    }
];

export default function DownloadPage() {
  return (
    <div className="bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/XFitnesslogonob.png" alt="XFitness" width={120} height={40} className="h-10 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="/#features" className="text-white hover:text-yellow-400 transition-colors font-bold uppercase text-sm tracking-wide">Features</a>
              <a href="/#membership" className="text-white hover:text-yellow-400 transition-colors font-bold uppercase text-sm tracking-wide">Membership</a>
              <a href="/#locations" className="text-white hover:text-yellow-400 transition-colors font-bold uppercase text-sm tracking-wide">Location</a>
              <a href="/#about" className="text-white hover:text-yellow-400 transition-colors font-bold uppercase text-sm tracking-wide">About</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-yellow-400 hover:bg-white/5 font-bold uppercase">Log In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <Image
          src="/modern-gym-interior-with-neon-lighting.jpg"
          alt="Gym Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
        <motion.div
          className="relative z-10 container mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-yellow-400 font-bold uppercase tracking-widest mb-4">
                <AnimatedLetters text="The XFitness App" />
              </p>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                <AnimatedLetters text="Unlock Your " />
                <span className="text-yellow-400">
                  <AnimatedLetters text="Potential." />
                </span>
              </h1>
              <p className="text-lg text-white/70 mb-10 max-w-lg mx-auto lg:mx-0">The official XFitness app is your all-in-one digital key. Purchase and manage your membership and unlock the doors to a world-class fitness experience.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                  <AppleLogo className="w-6 h-6" />
                  <div>
                    <span className="text-xs block">Download on the</span>
                    <span className="text-lg font-bold leading-tight">App Store</span>
                  </div>
                </a>
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                  <GooglePlayLogo className="w-6 h-6" />
                  <div>
                    <span className="text-xs block">GET IT ON</span>
                    <span className="text-lg font-bold leading-tight">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="relative mx-auto bg-zinc-900 border-4 border-zinc-800 rounded-[54px] h-[640px] w-[320px] shadow-2xl shadow-yellow-400/10">
                    <div className="relative w-full h-full overflow-hidden rounded-[46px] bg-black">
                        <div className="absolute top-4 inset-x-0 px-6 text-white/80 text-sm flex justify-between items-center z-20">
                            <span>8:30</span>
                            <div className="flex items-center gap-2">
                                <Wifi className="w-4 h-4" />
                                <BatteryCharging className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-7 bg-black z-10 flex justify-center items-center rounded-full w-28"></div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black z-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut"
                                }}
                                className="relative"
                            >
                                <Image
                                    src="/XFitnesslogonob.png"
                                    alt="XFitness Logo"
                                    width={150}
                                    height={50}
                                    className="filter drop-shadow-[0_0_25px_rgba(252,211,77,0.8)]"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </motion.div>
      </div>

      <section className="py-24 bg-black relative z-10">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
                <AnimatedLetters text="Everything You Need, " />
                <span className="text-yellow-400">
                    <AnimatedLetters text="In Your Pocket" />
                </span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto mb-16">
                Our app is more than just an access key—it's your ultimate fitness companion.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 group">
                {featureCards.map((feature, index) => {
                    const Icon = feature.icon as React.ElementType<LucideProps>;
                    return (
                        <motion.div
                            key={index}
                            className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 group-hover:blur-sm group-hover:opacity-50 transition-all duration-300 hover:!blur-none hover:!opacity-100"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Icon className="w-10 h-10 text-yellow-400 mb-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                            <h3 className="text-2xl font-bold uppercase mb-2">{feature.title}</h3>
                            <p className="text-white/60">{feature.description}</p>
                        </motion.div>
                    )
                })}
            </div>
        </div>
      </section>

      <footer className="relative z-10 bg-black border-t border-yellow-400/20">
        <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
                <a href="/" className="flex items-center gap-3">
                <Image src="/XFitnesslogonob.png" alt="XFitness" width={120} height={40} className="h-10 w-auto" />
                </a>
                <p className="text-white/60 text-sm leading-relaxed">
                Premium equipment, unbeatable vibe, real results.
                </p>
            </div>
            <div>
                <h4 className="text-white font-black uppercase mb-4">Quick Links</h4>
                <ul className="space-y-3">
                {["Features", "Membership", "Location", "About"].map((link) => (
                    <li key={link}>
                    <a href={`/#${link.toLowerCase()}`} className="text-white/60 hover:text-yellow-400 transition-colors">
                        {link}
                    </a>
                    </li>
                ))}
                </ul>
            </div>
            <div>
                <h4 className="text-white font-black uppercase mb-4">Support</h4>
                <ul className="space-y-3">
                {["Contact Us", "FAQ", "Terms of Service", "Privacy Policy"].map((link) => (
                    <li key={link}> <a href="#" className="text-white/60 hover:text-yellow-400 transition-colors"> {link} </a> </li>
                ))}
                </ul>
            </div>
            <div>
                <h4 className="text-white font-black uppercase mb-4">Connect</h4>
                <div className="flex gap-4">
                <a href="https://www.instagram.com/xfitness.my" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-yellow-400 flex items-center justify-center transition-colors group">
                    <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.792 2.792c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-2.792 2.792c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-2.792-2.792c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 012.792-2.792c.636-.247 1.363.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.75-9.25a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
                    </svg>
                </a>
                </div>
                <div className="mt-6 space-y-2">
                <p className="text-white/60 text-sm">Phone: 011-7260 3994</p>
                </div>
            </div>
            </div>
            <div className="pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm text-center">© 2025 X Fitness. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}