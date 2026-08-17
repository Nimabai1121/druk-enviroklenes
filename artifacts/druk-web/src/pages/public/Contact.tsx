import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCompanyInfo } from '@/hooks/useCompany';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { data: company } = useCompanyInfo();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' }
  });

  // Web3Forms configuration
  const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
  const ACCESS_KEY = '4d17095a-0ab8-4515-a1e3-dd0340c3468e';

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          // botcheck is not required but helps prevent spam
          // botcheck: false, // Remove comment to enable captcha
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for contacting us. We will get back to you shortly.",
        });
        form.reset();
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Web3Forms Error:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12 md:mb-16">
          <h1 className="font-display text-5xl md:text-7xl uppercase text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Get in touch with our commercial and technical teams for inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <div className="space-y-8">
            <GlassCard className="p-8">
              <h2 className="font-display text-2xl tracking-wide text-foreground mb-6">Corporate Office & Plant</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border border-primary/20">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Address</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {company?.address || 'Norbugang Industrial Park\nSamtse, Bhutan'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border border-primary/20">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground">{company?.phone || '05-365946'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border border-primary/20">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">{company?.email || 'contact@drukenviro.bt'}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border/50 bg-card/20 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1758.0123538262237!2d89.04955637529174!3d26.92099905764314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sbt!4v1784885858468!5m2!1sen!2sbt"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
              <div className="absolute bottom-4 left-4 right-4 z-10 rounded-lg border border-border/50 bg-background/80 backdrop-blur-md px-4 py-3">
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-sm uppercase tracking-wider">Norbugang Industrial Park, Samtse, Bhutan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <GlassCard className="p-8">
            <h2 className="font-display text-2xl tracking-wide text-foreground mb-6">Send an Inquiry</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Fill in the form and we'll get back to you as soon as possible.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Nima" className="bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="nima09@gmail.com" className="bg-background/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Inquiry" className="bg-background/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="How can we help you?" className="min-h-[150px] bg-background/50 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button 
                  type="submit" 
                  className="w-full uppercase tracking-wider font-bold" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" /> 
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  );
}