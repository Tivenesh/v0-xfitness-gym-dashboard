"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#app", label: "App" },
  { href: "/#membership", label: "Membership" },
  { href: "/#locations", label: "Location" },
  { href: "/#about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            {/* Left Side: Logo */}
            <div className="flex-1 flex justify-start">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/XFitnesslogonob.png" alt="XFitness" width={120} height={40} className="h-10 w-auto" />
              </Link>
            </div>

            {/* Center Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "font-bold uppercase text-sm tracking-wide transition-colors",
                      isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex-1 flex justify-end">
              <div className="hidden md:flex items-center gap-4">
                  <a href="/login">
                    <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5 font-bold uppercase">Log In</Button>
                  </a>
                  <a href="/download">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-black uppercase shadow-[0_0_20px_rgba(252,211,77,0.3)] hover:shadow-[0_0_30px_rgba(252,211,77,0.5)] transition-all">Join Now</Button>
                  </a>
              </div>
              {/* Mobile Hamburger Button */}
              <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(true)} className="text-white p-2">
                  <Menu className="h-7 w-7" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Render the Mobile Menu with an animation */}
      <AnimatePresence>
        {isMobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}