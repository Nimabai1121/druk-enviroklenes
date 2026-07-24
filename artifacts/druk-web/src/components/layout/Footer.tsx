import { Link } from 'wouter';
import { Factory, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center border border-primary/30">
                <Factory className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display text-xl tracking-wide text-foreground">DRUK ENVIROKLENES</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Precision smelting and heavy-industry manufacturing based in Bhutan. Forging the industrial future with uncompromising quality.
            </p>
          </div>
          
          <div>
            <h3 className="font-display tracking-wider text-lg mb-4 text-foreground">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/announcements" className="text-sm text-muted-foreground hover:text-primary transition-colors">Announcements</Link></li>
              <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display tracking-wider text-lg mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Pasakha Industrial Estate<br/>Phuentsholing, Bhutan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+975 17 11 22 33</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>contact@drukenviro.bt</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display tracking-wider text-lg mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Druk Enviroklenes Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
