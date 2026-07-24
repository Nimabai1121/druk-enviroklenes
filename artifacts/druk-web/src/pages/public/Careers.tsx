import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCareers } from '@/hooks/useCareers';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Careers() {
  const { data: careers, isLoading } = useCareers(true);

  // Group careers by department
  const groupedCareers = careers?.reduce((acc, career) => {
    if (!acc[career.department]) {
      acc[career.department] = [];
    }
    acc[career.department].push(career);
    return acc;
  }, {} as Record<string, typeof careers>);

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="mb-12 md:mb-16">
          <h1 className="font-display text-5xl md:text-7xl uppercase text-foreground mb-4">Careers</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Join the team forging Bhutan's industrial future. We are always looking for driven, skilled professionals.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-48 bg-card/20 rounded animate-pulse" />
                <div className="h-32 bg-card/20 rounded-xl border border-border/50 animate-pulse" />
                <div className="h-32 bg-card/20 rounded-xl border border-border/50 animate-pulse" />
              </div>
            ))}
          </div>
        ) : careers && careers.length > 0 ? (
          <div className="space-y-16">
            {Object.entries(groupedCareers || {}).map(([department, deptCareers], idx) => (
              <motion.div 
                key={department}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Building className="h-6 w-6 text-primary" />
                  <h2 className="font-display text-3xl text-foreground tracking-wide">{department}</h2>
                </div>
                
                <div className="grid gap-4">
                  {deptCareers.map((career) => (
                    <GlassCard key={career.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{career.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {career.location}</span>
                          <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> <span className="capitalize">{career.type.replace('-', ' ')}</span></span>
                        </div>
                        <p className="text-muted-foreground/80 leading-relaxed md:pr-12">
                          {career.description}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <Button className="w-full md:w-auto uppercase tracking-wider font-semibold">
                          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 px-4 bg-card/20 rounded-xl border border-border/50">
            <h3 className="text-xl font-medium text-foreground mb-2">No Open Positions</h3>
            <p className="text-muted-foreground">We are not actively hiring at the moment, but we're always happy to receive resumes from talented individuals.</p>
            <Button variant="outline" className="mt-6">Submit General Application</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
