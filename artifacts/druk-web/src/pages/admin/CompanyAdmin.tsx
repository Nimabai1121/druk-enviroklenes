import { AdminLayout } from '@/components/layout/AdminLayout';
import { useCompanyInfo, useUpdateCompanyInfo } from '@/hooks/useCompany';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function CompanyAdmin() {
  const { data: company, isLoading } = useCompanyInfo();
  const updateInfo = useUpdateCompanyInfo();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    try {
      await updateInfo.mutateAsync({ key, value: formData[key] });
      toast({ title: 'Saved successfully', description: `Updated ${key.replace('_', ' ')}` });
    } catch (err) {
      toast({ title: 'Failed to save', description: 'Please try again', variant: 'destructive' });
    }
  };

  const fields = [
    { key: 'company_name', label: 'Company Name', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'address', label: 'Office Address', type: 'textarea' },
    { key: 'phone', label: 'Phone Number', type: 'text' },
    { key: 'email', label: 'Contact Email', type: 'text' },
    { key: 'founded_year', label: 'Founded Year', type: 'text' },
    { key: 'about_text', label: 'About Text (Short)', type: 'textarea' },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-muted-foreground">Loading company information...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-display tracking-widest text-foreground">COMPANY INFORMATION</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage global site settings and contact details.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <div className="grid gap-8 max-w-3xl">
          {fields.map((field) => (
            <div key={field.key} className="grid grid-cols-[1fr_auto] gap-4 items-start border-b border-border/50 pb-6 last:border-0 last:pb-0">
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium text-foreground uppercase tracking-wider">{field.label}</label>
                {field.type === 'textarea' ? (
                  <Textarea 
                    value={formData[field.key] || ''} 
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="min-h-[100px] resize-y bg-background"
                  />
                ) : (
                  <Input 
                    value={formData[field.key] || ''} 
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="bg-background"
                  />
                )}
              </div>
              <div className="pt-8">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSave(field.key)}
                  disabled={formData[field.key] === company?.[field.key]}
                >
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
