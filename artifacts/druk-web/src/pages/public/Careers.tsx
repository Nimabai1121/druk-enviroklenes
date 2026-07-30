import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCareers } from '@/hooks/useCareers';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building, ArrowRight, Clock, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Careers() {
  const { data: careers, isLoading } = useCareers(true);

  // Google Form URL with the correct entry ID for position field
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfk_5cAaiLB0Lk-FPAcT1-UZst8nXXIP56ChWCYNWIbid9tnQ/viewform';
  const POSITION_ENTRY_ID = 'entry.42473757';

  // Filter out expired jobs
  const activeCareers = careers?.filter(career => {
    // Check if job has a deadline and if it's passed
    if (career.deadline && new Date(career.deadline) <= new Date()) {
      return false; // Exclude expired jobs
    }
    return true; // Keep active jobs
  }) || [];

  // Group careers by department
  const groupedCareers = activeCareers?.reduce((acc, career) => {
    if (!acc[career.department]) {
      acc[career.department] = [];
    }
    acc[career.department].push(career);
    return acc;
  }, {} as Record<string, typeof careers>);

  const handleApply = (jobTitle: string) => {
    // Pre-fill the job title in the Google Form
    const prefilledUrl = `${GOOGLE_FORM_URL}?usp=pp_url&${POSITION_ENTRY_ID}=${encodeURIComponent(jobTitle)}`;
    window.open(prefilledUrl, '_blank');
  };

  // Format deadline for display
  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

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
        ) : activeCareers && activeCareers.length > 0 ? (
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
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" /> {career.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4" /> 
                            <span className="capitalize">{career.type?.replace('-', ' ')}</span>
                          </span>
                          {career.deadline && (
                            <span className="flex items-center gap-1.5 text-amber-500">
                              <Clock className="h-4 w-4" /> 
                              Apply by {formatDeadline(career.deadline)}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground/80 leading-relaxed md:pr-12">
                          {career.description}
                        </p>
                        
                        {/* TOR / Position Profile Attachment */}
                        {career.attachment_url && career.attachment_name && (
                          <div className="mt-4">
                            <a
                              href={career.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                            >
                              <FileText className="h-4 w-4" />
                              <span>View Full Position Profile</span>
                              <Download className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({career.attachment_name})
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <Button 
                          className="w-full md:w-auto uppercase tracking-wider font-semibold"
                          onClick={() => handleApply(career.title)}
                        >
                          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        {career.attachment_url && career.attachment_name && (
                          <span className="text-[10px] text-muted-foreground/60">
                            PDF • {career.attachment_name.split('.').pop()?.toUpperCase()}
                          </span>
                        )}
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
            <p className="text-muted-foreground">
              We are not actively hiring at the moment, but we're always happy to receive resumes from talented individuals.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
            >
              Submit General Application
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}