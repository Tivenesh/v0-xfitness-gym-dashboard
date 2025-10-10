import Image from "next/image";
import Link from "next/link";
import React from "react";

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

// Social Media Icons
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8v2a5 5 0 0 1-5 5H8V7a5 5 0 0 1 5-5h2Z"></path><path d="M11 17a5 5 0 0 0 5 5v0a5 5 0 0 0 5-5V7A5 5 0 0 0 16 2"></path></svg>
);

// Helper component for individual footer links
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a href={href} className="text-white/60 hover:text-yellow-400 transition-colors text-base">
      {children}
    </a>
  </li>
);

export function Footer() {
  return (
    <footer className="relative z-10 bg-black border-t border-yellow-400/20">
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="mb-16 flex justify-center">
          <Link href="/">
            <Image 
              src="/XFitnesslogonob.png" 
              alt="XFitness Logo" 
              width={200} 
              height={80} 
              className="h-16 w-auto md:h-20" 
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-20 max-w-4xl mx-auto text-left md:text-center">
          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-lg mb-6">Explore</h4>
            <ul className="space-y-3">
              <FooterLink href="/#features">Features</FooterLink>
              <FooterLink href="/#app">App</FooterLink>
              <FooterLink href="/#membership">Membership</FooterLink>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              <FooterLink href="/#about">About Us</FooterLink>
              <FooterLink href="/#locations">Location</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider text-lg mb-6">Legal</h4>
            <ul className="space-y-3">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms & Conditions</FooterLink>
            </ul>
          </div>
        </div>

        <div className="space-y-16">
            {/* Download App Section */}
            <div className="space-y-6">
              <h4 className="font-bold text-white uppercase tracking-wider text-lg">
                Download Our App
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

            {/* Follow Us Section */}
            <div className="space-y-6">
                <h4 className="font-bold text-white uppercase tracking-wider text-lg">Follow Us</h4>
                <div className="flex justify-center gap-6">
                    <a href="https://www.instagram.com/xfitness.my" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-yellow-400 transition-colors">
                        <InstagramIcon className="w-8 h-8"/>
                    </a>
                    <a href="https://www.facebook.com/xfitness.my/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-yellow-400 transition-colors">
                        <FacebookIcon className="w-8 h-8"/>
                    </a>
                 
                </div>
            </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 py-6">
        <p className="text-white/40 text-sm text-center">© 2025 X Fitness. All rights reserved.</p>
      </div>
    </footer>
  );
}

