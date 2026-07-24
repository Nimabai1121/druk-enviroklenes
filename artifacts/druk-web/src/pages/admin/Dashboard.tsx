import { AdminLayout } from '@/components/layout/AdminLayout';
import { useProducts } from '@/hooks/useProducts';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useCareers } from '@/hooks/useCareers';
import { Link } from 'wouter';
import { Package, Megaphone, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: products } = useProducts();
  const { data: announcements } = useAnnouncements();
  const { data: careers } = useCareers();

  const stats = [
    { label: 'Total Products', value: products?.length || 0, icon: Package, href: '/admin/products', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Announcements', value: announcements?.length || 0, icon: Megaphone, href: '/admin/announcements', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Open Positions', value: careers?.filter(c => c.is_active)?.length || 0, icon: Users, href: '/admin/careers', color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-widest text-foreground">CONTROL ROOM</h1>
        <p className="text-muted-foreground mt-1">System overview and quick access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-3xl font-display tracking-widest text-foreground">{stat.value}</h3>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <Icon className={`h-7 w-7 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl flex flex-col shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-foreground">Recent Announcements</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/announcements">View All</Link>
            </Button>
          </div>
          <div className="p-0 flex-1">
            {announcements && announcements.length > 0 ? (
              <div className="divide-y divide-border">
                {announcements.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-4 px-6 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-foreground truncate pr-4">{item.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${item.is_published ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.excerpt}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">No announcements found.</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-dashed border-2 hover:border-primary hover:text-primary" asChild>
              <Link href="/admin/products"><Package className="h-5 w-5" /> Manage Products</Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-dashed border-2 hover:border-primary hover:text-primary" asChild>
              <Link href="/admin/announcements"><Megaphone className="h-5 w-5" /> Write Announcement</Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-dashed border-2 hover:border-primary hover:text-primary" asChild>
              <Link href="/admin/careers"><Users className="h-5 w-5" /> Post Job Opening</Link>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-dashed border-2 hover:border-primary hover:text-primary" asChild>
              <Link href="/admin/company"><ArrowRight className="h-5 w-5" /> Edit Company Info</Link>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
