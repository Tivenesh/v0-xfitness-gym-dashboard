// Create this new file at: components/LogoMarquee.tsx

import Image from 'next/image';
import React from 'react';

// This is the block of content that will be repeated
const MarqueeContent = () => {
    // We repeat the logo many times to ensure the strip is long
    const logos = Array(20).fill(0); 
    return (
        <>
            {logos.map((_, index) => (
                <div key={index} className="mx-8 flex-shrink-0 flex items-center justify-center">
                    <Image 
                        src="/XFitnesslogonob.png" 
                        alt="XFitness Logo" 
                        width={150} 
                        height={60} 
                        className="w-auto h-10 md:h-12" 
                    />
                </div>
            ))}
        </>
    );
};

export function LogoMarquee() {
  return (
    <div className="relative w-full overflow-x-hidden py-6 bg-black">
      <div className="flex animate-marquee whitespace-nowrap">
        <MarqueeContent />
        {/* We add a second identical block to make the loop seamless */}
        <MarqueeContent />
      </div>
    </div>
  );
}