import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, Globe, Leaf } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

export default function About() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-background">
      <Navbar />

      <main className="flex-1 pt-24 z-10 pb-20">
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 md:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="font-display text-5xl md:text-7xl uppercase text-foreground mb-6">Our Legacy</h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Established in 2012 in Pasakha, Bhutan's premier industrial estate, Druk Enviroklenes was founded with a clear mandate: to produce world-class ferroalloys leveraging the kingdom's clean hydroelectric power.
            </p>
          </motion.div>
        </section>

        <section className="py-16 bg-card/20 border-y border-border/50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative aspect-[4/3] bg-card rounded-xl overflow-hidden border border-border/50 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10" />
                <Zap className="h-32 w-32 text-primary/20 z-0" />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="font-display text-4xl mb-6 text-foreground">Manufacturing Capabilities</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our facility is equipped with state-of-the-art submerged arc furnaces capable of producing a wide range of ferroalloys with precise chemical compositions. We maintain strict control over every stage of the smelting process.
                </p>
                <div className="space-y-6 mt-8">
                  {[
                    { title: "Precision Control", desc: "Automated batching and feeding systems ensure exact chemical compositions." },
                    { title: "High-Capacity Furnaces", desc: "Multiple submerged arc furnaces optimized for continuous, high-yield operation." },
                    { title: "Advanced Laboratory", desc: "In-house spectrometer and chemical lab for immediate quality verification." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="font-display text-primary">{i+1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-lg mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-foreground">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Uncompromising Quality", desc: "We adhere strictly to international standards, ensuring every batch meets the exact specifications required by our clients." },
              { icon: Leaf, title: "Environmental Stewardship", desc: "Operating in Bhutan means a commitment to sustainability. We utilize clean energy and maintain advanced emission control systems." },
              { icon: Target, title: "Operational Excellence", desc: "Continuous improvement in our smelting processes to maximize efficiency and maintain competitive advantage." }
            ].map((value, i) => (
              <GlassCard key={i} className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-4 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="py-16 bg-primary/5 border-y border-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl mb-6 text-foreground">Global Reach, Local Commitment</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
              While we export our premium ferroalloys across the region and beyond, we remain deeply rooted in our community, providing employment and supporting local industrial development in Bhutan.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <Globe className="h-5 w-5" />
              <span>Serving Markets Across Asia and Beyond</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
