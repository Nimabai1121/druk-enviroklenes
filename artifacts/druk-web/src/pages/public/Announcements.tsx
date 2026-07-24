import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';

export default function Announcements() {
  const { data: announcements, isLoading } = useAnnouncements(true);

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
            {announcements.map((announcement, i) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard className="p-6 md:p-8 hover:border-primary/50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-2 text-primary text-sm font-medium mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{announcement.published_at ? new Date(announcement.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display tracking-wide text-foreground mb-4 group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {announcement.excerpt || announcement.content.substring(0, 150) + '...'}
                  </p>
                  <div className="flex items-center text-sm font-medium text-foreground group-hover:text-primary transition-colors uppercase tracking-wide">
                    Read Full Update <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
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
