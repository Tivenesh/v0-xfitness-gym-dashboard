"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Data for the features slideshow
const features = [
  { name: "Powerlifting Sanctuary", image: "/squatrack.jpeg" },
  { name: "State-of-the-Art Matrix Equipment", image: "/equipmentArea.jpeg" },
  { name: "Immersive JBL Pro Sound", image: "/dumbell area.jpeg" },
  { name: "The Aesthetic Zone", image: "/locker.jpeg" },
  { name: "Spacious Male Toilet", image: "/maletoilet.jpeg" },
  { name: "Modern Female Toilet", image: "/femaletoilet.jpeg" },
];

// Reusable component for scroll-triggered animations
const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
        hidden: { opacity: 0, y: 50 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimationActive, setAnimationActive] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Ensure animation runs on every full page load
    setAnimationActive(true);
    setIsOpening(false);

    // Timer for the features slideshow
    const slideTimer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % features.length);
    }, 3000);

    // Start opening the loading screen doors after 3 seconds
    const openTimer = setTimeout(() => {
        setIsOpening(true);
    }, 3000);

    // Remove the loading screen from the DOM after the animation completes (3s wait + 1s animation)
    const removeTimer = setTimeout(() => {
        setAnimationActive(false);
    }, 4000);

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(slideTimer)
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <>
      {/* Loading Screen Animation */}
      {isAnimationActive && (
        <div id="loading-screen" className={isOpening ? 'opening' : ''}>
          <div className="door-left door"></div>
          <img src="/XFitnesslogonob.png" className="loading-logo" alt="XFitness Logo" />
          <div className="door-right door"></div>
        </div>
      )}

      <div className="min-h-screen bg-black">
        {/* Global Background */}
        <div className="fixed inset-0 z-0">
          <img
            src="/modern-gym-interior-with-neon-lighting.jpg"
            alt="Gym Background"
            className="object-cover opacity-30 w-full h-full"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-primary/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-3">
                <img src="/XFitnesslogonob.png" alt="XFitness" width={120} height={40} className="h-10 w-auto" />
              </a>
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-white hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide">Features</a>
                <a href="#membership" className="text-white hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide">Membership</a>
                <a href="#locations" className="text-white hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide">Location</a>
                <a href="#about" className="text-white hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide">About</a>
              </div>
              <div className="flex items-center gap-4">
                <a href="/login">
                  <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5 font-bold uppercase">Log In</Button>
                </a>
                <a href="/signup">
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-black uppercase shadow-[0_0_20px_rgba(252,211,77,0.3)] hover:shadow-[0_0_30px_rgba(252,211,77,0.5)] transition-all">Join Now</Button>
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>
            <div className="relative z-10 container mx-auto px-6 text-center">
              <div className="max-w-5xl mx-auto space-y-8">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none">
                  Premium Equipment.
                  <br />
                  <span className="text-yellow-400">Unbeatable Vibe.</span>
                </h1>
                <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium">
                  Experience world-class gym facilities designed to elevate your fitness journey.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
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
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - Now wrapped in AnimatedSection */}
          <AnimatedSection>
            <section id="features" className="relative py-24 border-t border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
                    World Class <span className="text-yellow-400">Features</span>
                  </h2>
                  <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium">
                    We are a serious gym for people who are serious about their results. Here’s what sets us apart.
                  </p>
                </div>
              </div>
              <div className="relative w-full h-[60vh] overflow-hidden">
                {features.map((feature, index) => (
                  <div
                    key={feature.name}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <img
                      src={feature.image}
                      alt={feature.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                      <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">{feature.name}</h3>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {features.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 w-8 rounded-full transition-colors ${index === currentSlide ? 'bg-yellow-400' : 'bg-white/50'}`}></button>
                  ))}
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Membership Plans Section - Now wrapped in AnimatedSection */}
          <AnimatedSection>
            <section id="membership" className="relative py-24 border-t border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
                    Membership <span className="text-yellow-400">Plans</span>
                  </h2>
                  <p className="text-2xl text-yellow-400/80 max-w-3xl mx-auto font-black tracking-wide">
                    FITNESS ≠ LUXURY, IT'S FOR EVERYONE.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                  {/* 1 Month Plan */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-black rounded-2xl p-8 border border-white/10 group-hover:border-yellow-400/50 transition-all duration-300 h-full flex flex-col">
                      <div className="space-y-6 flex-grow">
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase mb-2">1 Month</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">RM139</span>
                          </div>
                        </div>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span className="text-white/80">Full Gym Access</span>
                          </li>
                        </ul>
                      </div>
                      <a href="/signup" className="block mt-6">
                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6">Sign Up</Button>
                      </a>
                    </div>
                  </div>
                  {/* 3 Months Plan */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-400 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-zinc-900 rounded-2xl p-8 border-2 border-yellow-400 h-full flex flex-col">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-sm uppercase">Popular</span>
                      </div>
                      <div className="space-y-6 flex-grow">
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase mb-2">3 Months</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-yellow-400">RM349</span>
                          </div>
                          <p className="text-white/60">RM116.3/month</p>
                        </div>
                        <ul className="space-y-4">
                          {["Free Joining Fee", "Free Shaker & Tote Bag", "Free Key Fob"].map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              <span className="text-white/80">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a href="/signup" className="block mt-6">
                        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6">Sign Up</Button>
                      </a>
                    </div>
                  </div>
                  {/* 6 Months Plan */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-black rounded-2xl p-8 border border-white/10 group-hover:border-yellow-400/50 transition-all duration-300 h-full flex flex-col">
                      <div className="space-y-6 flex-grow">
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase mb-2">6 Months</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">RM659</span>
                          </div>
                          <p className="text-white/60">RM109.8/month</p>
                        </div>
                        <ul className="space-y-4">
                          {["Free Joining Fee", "Free Shaker & Tote Bag", "Free Key Fob"].map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              <span className="text-white/80">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a href="/signup" className="block mt-6">
                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6">Sign Up</Button>
                      </a>
                    </div>
                  </div>
                  {/* 12 Months Plan */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-black rounded-2xl p-8 border border-white/10 group-hover:border-yellow-400/50 transition-all duration-300 h-full flex flex-col">
                      <div className="absolute -top-3 right-[-10px]">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full font-black text-xs uppercase shadow-lg">+ 1 Month Free</span>
                      </div>
                      <div className="space-y-6 flex-grow">
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase mb-2">12 Months</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">RM1199</span>
                          </div>
                          <p className="text-white/60">RM99.9/month</p>
                        </div>
                        <ul className="space-y-4">
                          {["Free Joining Fee", "Free Shaker & Tote Bag", "Free Key Fob"].map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              <span className="text-white/80">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a href="/signup" className="block mt-6">
                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6">Sign Up</Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>
          
          {/* Location & Hours Section - Now wrapped in AnimatedSection */}
          <AnimatedSection>
            <section id="locations" className="relative py-24 border-t border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
                    Location & <span className="text-yellow-400">Hours</span>
                  </h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6 text-center lg:text-left">
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-400 uppercase tracking-wide">Address</h3>
                      <p className="text-lg text-white/80 mt-2">
                        33A, 33B, Jalan Bestari 12/2, <br /> Taman Nusa Bestari, Skudai, <br /> Johor Bahru 79100, Malaysia.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-400 uppercase tracking-wide">Operating Hours</h3>
                      <p className="text-lg text-white/80 mt-2">Everyday | 6 AM - 1 AM</p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-yellow-400 uppercase tracking-wide">Contact</h3>
                      <p className="text-lg text-white/80 mt-2">011-7260 3994</p>
                    </div>
                  </div>
                  <div className="relative h-[400px] rounded-lg overflow-hidden border-2 border-yellow-400/20">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.261203544525!2d103.65582237496643!3d1.482153298418044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da73c509893e3d%3A0xf675270388907996!2s33B%2C%20Jalan%20Bestari%2012%2F2%2C%20Taman%20Nusa%20Bestari%2C%2079150%20Skudai%2C%20Johor!5e0!3m2!1sen!2smy!4v1728362002598!5m2!1sen!2smy"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* About Section - Now wrapped in AnimatedSection */}
          <AnimatedSection>
            <section id="about" className="relative py-24 border-t border-white/10 bg-black/50 backdrop-blur-sm">
              <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="relative h-[500px] rounded-lg overflow-hidden border-2 border-yellow-400/20">
                    <img src="/weightlifting.jpg" alt="Athlete training at XFitness" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight">
                      About <span className="text-yellow-400">XFitness</span>
                    </h2>
                    <p className="text-lg text-white/80 leading-relaxed">
                      XFitness is the challenger of the fitness landscape. Emerging from a vision to revolutionize how people
                      experience fitness, we built a distinct community that has transformed the industry. Energetic, trendy
                      and genuinely enjoyable, our club is designed to keep your spirits high.
                    </p>
                    <p className="text-lg text-white/80 leading-relaxed">
                      With an unmistakable high-energy atmosphere, specialized zones and top-notch equipment, we make working
                      out as fun as going out. To keep your energy high, we've installed a premium JBL Pro Sound system that
                      pumps out motivating beats throughout your workout.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-black border-t border-primary/20">
          <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="space-y-4">
                <a href="/" className="flex items-center gap-3">
                  <img src="/XFitnesslogonob.png" alt="XFitness" width={120} height={40} className="h-10 w-auto" />
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
                      <a href={`#${link.toLowerCase().replace(" ", "-")}`} className="text-white/60 hover:text-yellow-400 transition-colors">
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
                    {/* Placeholder for Instagram Icon */}
                    <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.792 2.792c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-2.792 2.792c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-2.792-2.792c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 012.792-2.792c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.75-9.25a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
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
    </>
  );
}