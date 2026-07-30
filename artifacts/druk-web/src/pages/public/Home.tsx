import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Zap, ShieldCheck, Factory, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { GlassCard } from '@/components/ui/glass-card';
import { useState, useEffect } from 'react';

// Hero images array - replace with your actual image imports
const heroImages = [
  '/image/hm.jpg',
  '/image/station.jpeg',
  '/image/plant.jpg',
  '/image/ed.jpeg',
  '/image/cr.jpeg',
  '/image/alloys.jpg', 
  '/image/images.jpg',
];

export default function Home() {
  const { data: products } = useProducts(true);
  const { data: announcements } = useAnnouncements(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Check if this is the first visit
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if the user has visited before
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    if (hasVisited) {
      return false; // Already visited, skip welcome
    }
    // First visit - show welcome
    sessionStorage.setItem('hasVisitedHome', 'true');
    return true;
  });
  
  const [progress, setProgress] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Welcome screen progress and fade out
  useEffect(() => {
    // Only run if welcome is showing
    if (!showWelcome) return;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Auto-hide welcome screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [showWelcome]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      {/* Welcome / Loading Screen - Only on first visit */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center max-w-md w-full px-8">
              {/* Logo with pulse animation - Enhanced */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mb-6"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      '0 0 20px rgba(0,0,0,0)',
                      '0 0 50px rgba(59,130,246,0.15)',
                      '0 0 20px rgba(0,0,0,0)'
                    ]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/20 bg-sky-950 flex items-center justify-center mx-auto shadow-2xl"
                >
                  <img 
                    src="/image/logo.jpg" 
                    alt="Exalt Druk Enviroklenes logo" 
                    className="h-[80%] w-[80%] object-contain" 
                  />
                </motion.div>
              </motion.div>

              {/* Company Name - Enhanced */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-center mb-8"
              >
                <h1 className="font-display text-3xl tracking-wide text-foreground">
                  DRUK ENVIROKLENES
                </h1>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium mt-1">
                  Pvt. Ltd.
                </p>
              </motion.div>

              {/* Loading Dots - Enhanced with staggered entrance */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex gap-3 mb-6"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -14, 0],
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                      duration: 0.9,
                      delay: i * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-amber-300"
                  />
                ))}
              </motion.div>

              {/* Progress Bar - Enhanced with glow effect */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full max-w-xs"
              >
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                  {/* Glow behind progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-amber-300/20 blur-sm" />
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-primary/80 to-amber-300 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  >
                    {/* Shimmer effect on progress */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
                <div className="flex justify-between mt-2.5">
                  <span className="text-xs text-muted-foreground tracking-wider">Loading</span>
                  <span className="text-xs font-mono font-medium text-primary/80">{Math.round(progress)}%</span>
                </div>
              </motion.div>

              {/* Tagline - Enhanced with pulse */}
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xs text-muted-foreground/60 mt-6 tracking-[0.2em] uppercase"
              >
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-2"
                >
                  <Zap className="w-3 h-3 text-primary" />
                  Precision Smelting & Alloys
                </motion.span>
              </motion.p>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute bottom-8 left-0 right-0 text-center"
              >
                <p className="text-[10px] text-muted-foreground/30 tracking-[0.3em] uppercase">
                  Est. 2025 • Norbugang, Bhutan
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of your homepage content... */}
      {/* Background abstract elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sidebar-primary/5 blur-[100px]" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Navbar />

      <main className="flex-1 z-10">
        {/* Hero Section - Full width with images */}
        <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Background Image Slider - Full Coverage */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
                >
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-background/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                </div>
                
                {/* Subtle blur effect */}
                <div 
                  className="absolute inset-0 backdrop-blur-[2px]"
                  style={{ 
                    background: 'rgba(0,0,0,0.05)',
                    backdropFilter: 'blur(1.5px)'
                  }} 
                />
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators - Bottom Center */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-600 ${
                    currentSlide === index 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation arrows - Glassmorphism style */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Slide counter - Glassmorphism */}
            <div className="absolute top-6 right-6 z-30 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-lg">
              {currentSlide + 1} / {heroImages.length}
            </div>
          </div>

          {/* Content - Overlaid on background with Glassmorphism */}
          <div className="relative z-20 max-w-7xl mx-auto w-full pt-32 pb-20 md:pt-40 md:pb-32">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl"
              >
                {/* Glassmorphism badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-primary shadow-lg mb-6">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium tracking-wide uppercase">Precision Smelting & Alloys</span>
                </div>
                
                <h1 className="font-display text-6xl md:text-8xl leading-[0.9] text-white mb-6 uppercase drop-shadow-xl">
                  Forging <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">Power</span><br />
                  With Precision.
                </h1>
                
                {/* Glassmorphism text card */}
                <div className="max-w-2xl mb-10 p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
                  <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                    Heavy-industry manufacturing based in Bhutan. The company is engaged in the production and export of high-quality ferro silicon, a critical alloy used in the steel, foundry, and metallurgical industries.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90">
                    <Link href="/products">Explore Products</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white">
                    <Link href="/about">Our Capabilities</Link>
                  </Button>
                </div>
              </motion.div>

              {/* Empty right column for balance */}
              <div className="hidden lg:block" />
            </div>
          </div>
        </section>

        {/* Stats Section - Glassmorphism */}
        <section className="py-12 border-y border-white/10 bg-white/5 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {[
                { label: "Daily Production", value: "45,000 T" },
                { label: "Export Markets", value: "12+" },
                { label: "Quality Rating", value: "IS 1110: 2023" },
                { label: "Commissioned", value: "Dec 2025" },
                { label: "Employees", value: "246+" }
              ].map((stat, i) => (
                <div key={i} className="text-center px-2 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="font-display text-2xl md:text-4xl text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl md:text-5xl mb-6 text-foreground">Uncompromising Quality<br/>From the Himalayas</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Strategically located in Norbugang, Bhutan's industrial hub, Exalt Druk Enviroklenes leverages clean hydroelectric power to produce premium ferroalloys with a reduced carbon footprint.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: ShieldCheck, text: "Rigorous quality control and chemical analysis" },
                  { icon: Factory, text: "State-of-the-art (18 MVA x 2 )submerged arc furnaces" },
                  { icon: Globe, text: "Strategic regional supply chain logistics" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <item.icon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/about" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
                Read our full story <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl"
            >
              <img
                src="/image/plant.jpg"
                alt="Overview section image"
                className="absolute inset-0 h-full w-full object-cover brightness-110 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/70 to-transparent z-10" />
            </motion.div>
          </div>
        </section>

        {/* Featured Products - Glassmorphism Cards */}
        <section className="py-24 bg-white/5 backdrop-blur-md border-y border-white/10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-display text-4xl text-foreground mb-2">Industrial Output</h2>
                <p className="text-muted-foreground">Premium ferroalloys for global markets.</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex text-foreground hover:text-primary">
                <Link href="/products">View All Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products?.slice(0, 3).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <GlassCard className="h-full flex flex-col group hover:border-primary/50 transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
                    <div className="aspect-[4/3] relative bg-card-foreground/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                         <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-card to-card-border flex items-center justify-center relative">
                          <Package className="h-16 w-16 text-muted-foreground/30" />
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium rounded-full border border-white/20 text-foreground">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-display tracking-wide text-foreground mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                        {product.description}
                      </p>
                      <Link href="/products" className="inline-flex items-center text-sm font-medium text-primary mt-auto hover:text-primary/80 transition-colors">
                        View specifications <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
            <Button asChild variant="ghost" className="w-full mt-8 sm:hidden text-foreground">
              <Link href="/products">View All Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        {/* Latest Announcements - Glassmorphism */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-4xl text-foreground mb-2">Company Updates</h2>
              <p className="text-muted-foreground">Latest news from our facilities.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {announcements?.slice(0, 2).map((announcement, i) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/announcements`}>
                  <GlassCard className="p-8 h-full hover:border-primary/50 transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 shadow-xl group">
                    <div className="text-sm text-primary font-medium mb-3">
                      {announcement.published_at ? new Date(announcement.published_at).toLocaleDateString() : ''}
                    </div>
                    <h3 className="text-2xl font-display text-foreground tracking-wide mb-3 group-hover:text-primary transition-colors">
                      {announcement.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {announcement.excerpt || announcement.content.substring(0, 100) + '...'}
                    </p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact CTA - Glassmorphism */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <h2 className="font-display text-5xl md:text-7xl text-foreground uppercase mb-6">Partner With Us</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Discuss your specific alloy requirements with our technical sales team.
              </p>
              <Button asChild size="lg" className="h-14 px-10 text-lg shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Package icon component
function Package(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}