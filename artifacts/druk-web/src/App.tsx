import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useEffect } from 'react';

// Public Pages
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Products from '@/pages/public/Products';
import Announcements from '@/pages/public/Announcements';
import Careers from '@/pages/public/Careers';
import Contact from '@/pages/public/Contact';

// Admin Pages
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import ProductsAdmin from '@/pages/admin/ProductsAdmin';
import AnnouncementsAdmin from '@/pages/admin/AnnouncementsAdmin';
import CareersAdmin from '@/pages/admin/CareersAdmin';
import CompanyAdmin from '@/pages/admin/CompanyAdmin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/products" component={Products} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/careers" component={Careers} />
      <Route path="/contact" component={Contact} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={Login} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/products" component={ProductsAdmin} />
      <Route path="/admin/announcements" component={AnnouncementsAdmin} />
      <Route path="/admin/careers" component={CareersAdmin} />
      <Route path="/admin/company" component={CompanyAdmin} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Enforce dark mode class on document
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
