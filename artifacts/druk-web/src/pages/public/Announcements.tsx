import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export default function Announcements() {
  const { data: announcements, isLoading } = useAnnouncements(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-12 md:mb-16">
          <h1 className="font-display text-5xl md:text-7xl uppercase text-foreground mb-4">Announcements</h1>
          <p className="text-xl text-muted-foreground">
            Official news, updates, and milestones from Druk Enviroklenes.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-card/20 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement, i) => {
              const isExpanded = expandedId === announcement.id;
              const hasImages = announcement.images && announcement.images.length > 0;
              
              return (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <GlassCard 
                    className="p-6 md:p-8 hover:border-primary/50 transition-colors group cursor-pointer"
                    onClick={() => toggleExpand(announcement.id)}
                  >
                    <div className="flex items-center gap-2 text-primary text-sm font-medium mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {announcement.published_at 
                          ? new Date(announcement.published_at).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          : 'Recent'
                        }
                      </span>
                      {hasImages && (
                        <span className="flex items-center gap-1 text-xs bg-muted/50 px-2 py-0.5 rounded-full">
                          <ImageIcon className="h-3 w-3" />
                          {announcement.images.length}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-display tracking-wide text-foreground mb-4 group-hover:text-primary transition-colors">
                      {announcement.title}
                    </h2>
                    
                    {/* Image Gallery */}
                    {hasImages && (
                      <div className={`grid gap-3 mb-4 ${
                        announcement.images.length === 1 ? 'grid-cols-1' :
                        announcement.images.length === 2 ? 'grid-cols-2' :
                        'grid-cols-2 md:grid-cols-3'
                      }`}>
                        {announcement.images.slice(0, isExpanded ? undefined : 3).map((img, idx) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden border border-border/50 aspect-video">
                            <img
                              src={img}
                              alt={`${announcement.title} - Image ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            {!isExpanded && idx === 2 && announcement.images.length > 3 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                  +{announcement.images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {isExpanded 
                        ? announcement.content 
                        : (announcement.excerpt || announcement.content.substring(0, 150) + '...')
                      }
                    </p>
                    
                    <div className="flex items-center text-sm font-medium text-foreground group-hover:text-primary transition-colors uppercase tracking-wide">
                      {isExpanded ? 'Show Less' : 'Read Full Update'}
                      <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-card/20 rounded-xl border border-border/50">
            <h3 className="text-xl font-medium text-foreground mb-2">No Announcements</h3>
            <p className="text-muted-foreground">Check back later for company updates.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}