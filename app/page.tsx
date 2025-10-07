import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/xfitness-logo.jpg" alt="XFitness" width={120} height={40} className="h-10 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#classes"
                className="text-white hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide"
              >
                Classes
              </Link>
              <Link
                href="#locations"
                className="text-white hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide"
              >
                Locations
              </Link>
              <Link
                href="#membership"
                className="text-white hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide"
              >
                Membership
              </Link>
              <Link
                href="#about"
                className="text-white hover:text-primary transition-colors font-bold uppercase text-sm tracking-wide"
              >
                About
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5 font-bold uppercase">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase shadow-[0_0_20px_rgba(252,211,77,0.3)] hover:shadow-[0_0_30px_rgba(252,211,77,0.5)] transition-all">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/modern-gym-interior-with-neon-lighting.jpg"
            alt="Gym Background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Neon Glow Effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none">
              Anything
              <br />
              <span className="text-primary">Goes</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-bold uppercase tracking-wide">
              Pay Nothing Until December
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-primary text-black hover:bg-primary/90 font-bold text-lg px-12 py-6 h-auto"
                >
                  Free Trial
                </Button>
              </Link>
              <Link href="#membership">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-lg px-12 py-6 h-auto bg-transparent"
                >
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="relative py-24 bg-black border-t border-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
              <span className="text-primary">Classes</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-medium">
              Discover over 70 classes at XFitness, spanning 7 different class categories from holistic to sadistic. You
              want it, we've got it!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                name: "Fight",
                count: 8,
                image: "/boxing-match.png",
                color: "from-red-500/20 to-orange-500/20",
              },
              {
                name: "Strength",
                count: 10,
                image: "/weightlifting.jpg",
                color: "from-primary/20 to-yellow-500/20",
              },
              {
                name: "Holistic",
                count: 15,
                image: "/woman-in-nature-yoga.png",
                color: "from-green-500/20 to-emerald-500/20",
              },
              {
                name: "Rhythm",
                count: 10,
                image: "/expressive-dance.png",
                color: "from-purple-500/20 to-pink-500/20",
              },
              {
                name: "Aerial",
                count: 11,
                image: "/aerial.jpg",
                color: "from-blue-500/20 to-cyan-500/20",
              },
              {
                name: "Ride",
                count: 2,
                image: "/cyclist-on-country-road.png",
                color: "from-primary/20 to-amber-500/20",
              },
              {
                name: "Sweat",
                count: 10,
                image: "/cardio.jpg",
                color: "from-orange-500/20 to-red-500/20",
              },
              {
                name: "HIIT",
                count: 12,
                image: "/hiit-workout.png",
                color: "from-primary/20 to-yellow-600/20",
              },
            ].map((category) => (
              <div
                key={category.name}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-40 transition-opacity`}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase mb-2">{category.name}</h3>
                  <p className="text-lg text-white/90 font-bold">{category.count} classes</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-primary font-bold uppercase text-sm">Find Out More →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="#classes">
              <Button
                size="lg"
                className="bg-primary text-black hover:bg-primary/90 font-black text-lg px-12 py-6 h-auto uppercase shadow-[0_0_20px_rgba(252,211,77,0.3)] hover:shadow-[0_0_30px_rgba(252,211,77,0.5)] transition-all"
              >
                Full Timetable
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section id="membership" className="relative py-24 bg-zinc-950 border-t border-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
              Membership <span className="text-primary">Plans</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Choose the plan that fits your lifestyle. All plans include access to our world-class facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-zinc-900 rounded-2xl p-8 border border-white/10 group-hover:border-primary/50 transition-all duration-300">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase mb-2">Basic</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">$29</span>
                      <span className="text-white/60">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {["Access to gym facilities", "Group fitness classes", "Personalized workout plan"].map(
                      (feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <svg
                            className="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ),
                    )}
                  </ul>
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary via-yellow-500 to-primary rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-zinc-900 rounded-2xl p-8 border-2 border-primary">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-black px-6 py-2 rounded-full font-black text-sm uppercase">
                    Popular
                  </span>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase mb-2">Premium</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-primary">$49</span>
                      <span className="text-white/60">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {["All Basic features", "Unlimited classes", "Nutrition guidance", "Priority booking"].map(
                      (feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <svg
                            className="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ),
                    )}
                  </ul>
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-6">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Elite Plan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-zinc-900 rounded-2xl p-8 border border-white/10 group-hover:border-primary/50 transition-all duration-300">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase mb-2">Elite</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">$79</span>
                      <span className="text-white/60">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {["All Premium features", "Exclusive training sessions", "VIP access", "Guest passes"].map(
                      (feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <svg
                            className="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ),
                    )}
                  </ul>
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-6">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="relative py-24 bg-black border-t border-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
              Find Your <span className="text-primary">Gym</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Multiple locations across the city, each equipped with state-of-the-art facilities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              "Downtown",
              "Westside",
              "Eastside",
              "Northside",
              "Southside",
              "Midtown",
              "Uptown",
              "Riverside",
              "Lakeside",
              "Hillside",
            ].map((location) => (
              <button
                key={location}
                className="group relative overflow-hidden rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 p-6 text-center border border-white/10 hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-300" />
                <p className="relative text-white font-bold text-lg group-hover:text-primary transition-colors">
                  {location}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 bg-zinc-950 border-t border-primary/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden border-2 border-primary/20">
              <Image src="/gym-facility.jpg" alt="XFitness Facility" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight">
                About <span className="text-primary">XFitness</span>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                XFitness is the challenger of the fitness landscape. Emerging from a vision to revolutionize how people
                experience fitness, we built a distinct community that has transformed the industry. Energetic, trendy
                and genuinely enjoyable, our clubs are designed to keep your spirits high.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                With an unmistakable nightclub atmosphere, specialized studios and top-notch equipment, we make working
                out as fun as going out. To keep your energy high, we've installed a premium sound system that pumps out
                motivating beats throughout your workout.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl">💪</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Best Equipment</p>
                      <p className="text-white/60 text-sm">State-of-the-art</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl">🥊</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Boxing Rings</p>
                      <p className="text-white/60 text-sm">Professional grade</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Personal Training</p>
                      <p className="text-white/60 text-sm">Expert coaches</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Multiple Locations</p>
                      <p className="text-white/60 text-sm">Across the city</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-primary/20">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/xfitness-logo.jpg" alt="XFitness" width={120} height={40} className="h-10 w-auto" />
              </Link>
              <p className="text-white/60 text-sm leading-relaxed">
                Revolutionizing fitness with state-of-the-art facilities and an unmistakable nightclub atmosphere.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black uppercase mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {["Classes", "Locations", "Membership", "About"].map((link) => (
                  <li key={link}>
                    <Link
                      href={`#${link.toLowerCase()}`}
                      className="text-white/60 hover:text-primary transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-black uppercase mb-4">Support</h4>
              <ul className="space-y-3">
                {["Contact Us", "FAQ", "Terms of Service", "Privacy Policy"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-white/60 hover:text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-black uppercase mb-4">Connect</h4>
              <div className="flex gap-4">
                {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-primary flex items-center justify-center transition-colors group"
                  >
                    <span className="text-white group-hover:text-black font-bold text-xs">{social.charAt(0)}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-white/60 text-sm">Email: info@xfitness.com</p>
                <p className="text-white/60 text-sm">Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-sm">© 2025 XFitness. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/login" className="text-white/60 hover:text-primary transition-colors text-sm">
                  Admin Login
                </Link>
                <Link href="/dashboard" className="text-white/60 hover:text-primary transition-colors text-sm">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
