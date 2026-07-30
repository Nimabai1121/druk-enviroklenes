import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useProducts } from '@/hooks/useProducts';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Package, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function Products() {
  const { data: products, isLoading } = useProducts(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    if (!products) return ['All'];
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12 md:mb-16">
          <h1 className="font-display text-5xl md:text-7xl uppercase text-foreground mb-4">Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Industrial-grade ferroalloys engineered for modern manufacturing.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-card/50 border-border hover:border-primary/50 text-foreground/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-xl bg-card/20 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <GlassCard className="h-full flex flex-col group overflow-hidden">
                  <div className="aspect-[4/3] relative bg-card-foreground/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {product.image_url ? (
                       <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-card to-card-border flex items-center justify-center relative">
                        <Package className="h-16 w-16 text-muted-foreground/30" />
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-display tracking-wide text-foreground mb-3">{product.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                      {product.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : 
        (
          <div className="text-center py-20 px-4 bg-card/20 rounded-xl border border-border/50">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
