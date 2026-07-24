import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Zap, ShieldCheck, Factory, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { GlassCard } from '@/components/ui/glass-card';

export default function Home() {
  const { data: products } = useProducts(true);
  const { data: announcements } = useAnnouncements(true);

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      {/* Background abstract elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sidebar-primary/5 blur-[100px]" />
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[80px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Navbar />

      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide uppercase">Precision Smelting & Alloys</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.9] text-foreground mb-6 uppercase">
              Forging <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">Power</span><br />
              With Precision.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Heavy-industry manufacturing based in Bhutan. We produce world-class ferroalloys engineered for the demands of modern infrastructure.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/25">
                <Link href="/products">Explore Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card">
                <Link href="/about">Our Capabilities</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border/50 bg-card/20 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-border/50">
              {[
                { label: "Annual Capacity", value: "45,000 MT" },
                { label: "Export Markets", value: "12+" },
                { label: "Quality Rating", value: "ISO 9001" },
                { label: "Founded", value: "2012" }
              ].map((stat, i) => (
                <div key={i} className="text-center px-4">
                  <div className="font-display text-4xl text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
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
                Strategically located in Pasakha, Bhutan's industrial hub, Druk Enviroklenes leverages clean hydroelectric power to produce premium ferroalloys with a reduced carbon footprint.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: ShieldCheck, text: "Rigorous quality control and chemical analysis" },
                  { icon: Factory, text: "State-of-the-art submerged arc furnaces" },
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
              className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden border border-border/50"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-card to-card/20 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Factory className="h-32 w-32 text-primary/20" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-card/30 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-display text-4xl text-foreground mb-2">Industrial Output</h2>
                <p className="text-muted-foreground">Premium ferroalloys for global markets.</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex">
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
                  <GlassCard className="h-full flex flex-col group hover:border-primary/50 transition-colors">
                    <div className="aspect-[4/3] relative bg-card-foreground/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                         <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-card to-card-border flex items-center justify-center relative">
                          <Package className="h-16 w-16 text-muted-foreground/30" />
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-medium rounded-full border border-border/50 text-foreground">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-display tracking-wide text-foreground mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                        {product.description}
                      </p>
                      <Link href="/products" className="inline-flex items-center text-sm font-medium text-primary mt-auto">
                        View specifications <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
            <Button asChild variant="ghost" className="w-full mt-8 sm:hidden">
              <Link href="/products">View All Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        {/* Latest Announcements */}
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
                  <GlassCard className="p-8 h-full hover:border-primary/50 transition-colors group">
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

        {/* Contact CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="font-display text-5xl md:text-7xl text-foreground uppercase mb-6">Partner With Us</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discuss your specific alloy requirements with our technical sales team.
            </p>
            <Button asChild size="lg" className="h-14 px-10 text-lg shadow-lg shadow-primary/25">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Just a dummy icon since Package isn't imported above
function Package(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}
