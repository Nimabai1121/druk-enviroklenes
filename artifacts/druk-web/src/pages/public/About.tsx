import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Target, Zap, Globe, Leaf, Factory, MapPin, Package, ChevronLeft, ChevronRight, Users, Calendar, Building, Award, TrendingUp, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useState, useEffect } from 'react';

// About page images
const aboutImages = [
  '/image/ed.jpeg',
  '/image/plant.jpg',
  '/image/station.jpeg',
  
];

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aboutImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % aboutImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + aboutImages.length) % aboutImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-background">
      <Navbar />

      <main className="flex-1 pt-24 z-10 pb-20">
        {/* Hero Section with Image Slider */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-4xl md:text-6xl uppercase text-foreground mb-4 leading-tight">
                Exalt Druk Enviroklens
              </h1>
              <p className="text-xl md:text-2xl text-primary font-medium mb-2">Private Limited (EDPL)</p>
              <div className="flex items-center gap-3 mb-4 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Norbugang Industrial Park (NIP), Samtse, Bhutan</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Exalt Druk Enviroklens Private Limited is a Bhutanese ferro silicon manufacturing company 
                located at Norbugang Industrial Park (NIP), Samtse Dzongkhag. The company is engaged in 
                the production and export of high-quality ferro silicon, a critical alloy used in the steel, 
                foundry, and metallurgical industries. Situated in one of Bhutan's emerging industrial hubs, 
                the company contributes significantly to the country's industrial growth, employment generation, 
                and export earnings. Public trade records also identify the company as an active importer of 
                industrial machinery and an exporter of ferro silicon products.
              </p>
            </motion.div>

            {/* Right Side - Image Slider */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden border border-border/50 bg-card/20 backdrop-blur-sm shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={aboutImages[currentSlide]}
                  alt={`About slide ${currentSlide + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10 pointer-events-none" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {aboutImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                {currentSlide + 1} / {aboutImages.length}
              </div>

              <div className="absolute bottom-12 left-4 right-4 z-20">
                <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-3 border border-white/10">
                  <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                    <Factory className="h-4 w-4 text-primary" />
                    Ferro Silicon Manufacturing
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">
                    Norbugang Industrial Park, Samtse, Bhutan
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
          {/* Mission & Vision */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-4">Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To produce high-quality ferro silicon through safe, efficient, and environmentally responsible operations while contributing to Bhutan's industrial development and economic growth.
                </p>
              </GlassCard>
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                  <Award className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-4">Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become one of the leading ferro alloy manufacturers in Bhutan and a trusted supplier of premium ferro silicon products in the regional market.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Operational Milestones */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-12 text-foreground">Operational Milestones</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              The company has achieved rapid operational growth since commissioning its manufacturing facilities:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-8 border-l-4 border-l-primary">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border border-primary/20">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-primary font-semibold uppercase tracking-wider">31 December 2025</div>
                    <h3 className="text-xl font-display text-foreground mt-1">First Ferro Silicon Furnace</h3>
                    <p className="text-muted-foreground mt-2">Successful commissioning of the First Ferro Silicon Furnace, marking the commencement of commercial production.</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-8 border-l-4 border-l-amber-500">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Calendar className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm text-amber-500 font-semibold uppercase tracking-wider">March 2026</div>
                    <h3 className="text-xl font-display text-foreground mt-1">Second Ferro Silicon Furnace</h3>
                    <p className="text-muted-foreground mt-2">Successful commissioning of the Second Ferro Silicon Furnace, substantially increasing the company's production capacity and operational efficiency.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
            <div className="mt-8 text-center">
              <div className="inline-block bg-primary/10 border border-primary/20 rounded-lg px-6 py-3">
                <p className="text-foreground font-medium">
                  With the commissioning of both furnaces, the company strengthened its position as one of Bhutan's growing ferro silicon producers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workforce */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-6 text-foreground">Workforce</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Exalt Druk Enviroklens Private Limited currently employs <span className="text-primary font-bold">246 personnel</span>, comprising:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Engineers",
              "Plant Operators",
              "Electricians",
              "Mechanical Technicians",
              "Instrumentation Personnel",
              "Safety and Environment Officers",
              "Quality Control Staff",
              "Human Resource and Administrative Staff",
              "Finance and Procurement Personnel",
              "Security Personnel",
              "Skilled Workers",
              "Semi-skilled Workers"
            ].map((role, i) => (
              <div key={i} className="flex items-center gap-2 bg-card/40 border border-border/40 rounded-lg px-4 py-3 hover:border-primary/30 transition-colors">
                <Users className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground/80">{role}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-block bg-primary/5 border border-primary/10 rounded-lg px-6 py-3">
              <p className="text-muted-foreground text-sm">
                The company is committed to creating sustainable employment opportunities while developing technical skills among Bhutanese professionals.
              </p>
            </div>
          </div>
        </section>

        {/* Manufacturing Facilities */}
        <section className="py-16 bg-card/20 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-6 text-foreground">Manufacturing Facilities</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              The manufacturing plant is equipped with:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Two Electric Submerged Arc Furnaces",
                "Raw Material Handling System",
                "Crushing and Screening Plant",
                "Pollution Control Equipment",
                "Power Distribution System",
                "Water Cooling and Utility Systems",
                "Laboratory and Quality Control Facilities",
                "Warehousing and Logistics Infrastructure"
              ].map((facility, i) => (
                <div key={i} className="flex items-center gap-3 bg-card/30 border border-border/40 rounded-lg px-4 py-3 hover:bg-card/50 transition-colors">
                  <Building className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground/80">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products and Applications */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-6 text-foreground">Products and Applications</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            The company's primary product is <span className="text-primary font-bold">Ferro Silicon</span>, which is widely used in:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Steel Manufacturing",
              "Alloy Steel Production",
              "Foundry Industry",
              "Iron Casting",
              "Deoxidation Process",
              "Inoculation of Cast Iron"
            ].map((app, i) => (
              <div key={i} className="flex items-center gap-3 bg-card/30 border border-border/40 rounded-lg px-4 py-4 hover:border-primary/30 transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border border-primary/20">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground/80">{app}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Commitment */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-12 text-foreground">Our Commitment</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Product Quality",
              "Workplace Safety",
              "Environmental Protection",
              "Operational Excellence",
              "Employee Development",
              "Customer Satisfaction",
              "Sustainable Industrial Growth"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-card/30 border border-border/40 rounded-lg px-4 py-3 hover:border-primary/30 transition-colors">
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contribution to Bhutan */}
        <section className="py-16 bg-primary/5 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-4xl md:text-5xl text-center mb-6 text-foreground">Contribution to Bhutan</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
              The company plays an important role in Bhutan's industrial sector by:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Supporting the country's industrial diversification",
                "Generating employment for Bhutanese citizens",
                "Producing value-added export products",
                "Contributing to foreign exchange earnings",
                "Promoting economic development in Samtse Dzongkhag",
                "Supporting the growth of Norbugang Industrial Park as a major industrial hub"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-card/30 border border-border/40 rounded-lg px-4 py-4 hover:border-primary/30 transition-colors">
                  <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Reach Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-6 text-foreground">Global Reach, Local Commitment</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
              While we export our premium Ferro Silicon (FeSi) across the region and beyond, 
              we remain deeply rooted in our community, providing employment and supporting 
              local industrial development in Bhutan.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-primary font-medium">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <Globe className="h-5 w-5" />
                <span>Exporting to India & Beyond</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <Factory className="h-5 w-5" />
                <span>Norbugang Industrial Park</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}