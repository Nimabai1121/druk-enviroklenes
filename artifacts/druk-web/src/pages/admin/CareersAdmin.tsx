import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useCareers, useCreateCareer, useUpdateCareer, useDeleteCareer } from '@/hooks/useCareers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, CalendarIcon, FileText, Upload, X, File, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Career } from '@/types/database';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const careerSchema = z.object({
  title: z.string().min(2, 'Title required'),
  department: z.string().min(2, 'Department required'),
  location: z.string().min(2, 'Location required'),
  type: z.enum(['full-time', 'part-time', 'contract']),
  description: z.string().min(10, 'Description too short'),
  is_active: z.boolean().default(true),
  deadline: z.string().nullable().optional(),
  attachment_url: z.string().nullable().optional(),
  attachment_name: z.string().nullable().optional()
});

// File upload function for TOR/Position Profile
async function uploadAttachment(file: File, folder: string = 'careers'): Promise<{ url: string; name: string }> {
  // Validate file type (PDF, DOC, DOCX)
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please upload a PDF or Word document');
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('documents') // Create a 'documents' bucket in Supabase
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Upload error:', error);
    throw new Error(error.message);
  }
  
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(data.path);
  
  return {
    url: urlData.publicUrl,
    name: file.name
  };
}

async function deleteAttachment(url: string): Promise<void> {
  const path = url.split('/public/documents/')[1];
  if (!path) return;
  
  const { error } = await supabase.storage
    .from('documents')
    .remove([path]);
  
  if (error) {
    console.error('Delete error:', error);
  }
}

export default function CareersAdmin() {
  const { data: careers, isLoading, refetch } = useCareers();
  const createItem = useCreateCareer();
  const updateItem = useUpdateCareer();
  const deleteItem = useDeleteCareer();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentAttachment, setCurrentAttachment] = useState<{ url: string; name: string } | null>(null);

  const form = useForm<z.infer<typeof careerSchema>>({
    resolver: zodResolver(careerSchema),
    defaultValues: { 
      title: '', 
      department: '', 
      location: 'Phuentsholing, Bhutan', 
      type: 'full-time', 
      description: '', 
      is_active: true,
      deadline: null,
      attachment_url: null,
      attachment_name: null
    }
  });

  const handleEdit = (item: Career) => {
    setEditingId(item.id);
    if (item.attachment_url && item.attachment_name) {
      setCurrentAttachment({
        url: item.attachment_url,
        name: item.attachment_name
      });
    } else {
      setCurrentAttachment(null);
    }
    form.reset({
      title: item.title,
      department: item.department,
      location: item.location,
      type: item.type,
      description: item.description,
      is_active: item.is_active,
      deadline: item.deadline || null,
      attachment_url: item.attachment_url || null,
      attachment_name: item.attachment_name || null
    });
    setIsOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setCurrentAttachment(null);
    form.reset({ 
      title: '', 
      department: '', 
      location: 'Phuentsholing, Bhutan', 
      type: 'full-time', 
      description: '', 
      is_active: true,
      deadline: null,
      attachment_url: null,
      attachment_name: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadAttachment(file, 'careers');
      setCurrentAttachment(result);
      form.setValue('attachment_url', result.url);
      form.setValue('attachment_name', result.name);
      toast.success('Document uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAttachment = () => {
    const currentUrl = form.getValues('attachment_url');
    if (currentUrl) {
      deleteAttachment(currentUrl).catch(console.error);
    }
    form.setValue('attachment_url', null);
    form.setValue('attachment_name', null);
    setCurrentAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Document removed');
  };

  const onSubmit = async (data: z.infer<typeof careerSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        // Get old career to delete old attachment if replaced
        const oldCareer = careers?.find(c => c.id === editingId);
        if (oldCareer?.attachment_url && oldCareer.attachment_url !== data.attachment_url) {
          await deleteAttachment(oldCareer.attachment_url);
        }
        
        await updateItem.mutateAsync({ id: editingId, data });
        toast.success('Job posting updated successfully!');
      } else {
        await createItem.mutateAsync(data);
        toast.success('Job posting created successfully!');
      }
      
      setIsOpen(false);
      setCurrentAttachment(null);
      refetch();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error?.message || 'Failed to save job posting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, attachmentUrl?: string | null) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      try {
        if (attachmentUrl) {
          await deleteAttachment(attachmentUrl);
        }
        await deleteItem.mutateAsync(id);
        toast.success('Job posting deleted successfully!');
        refetch();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error?.message || 'Failed to delete job posting');
      }
    }
  };

  const isJobExpired = (deadline?: string | null) => {
    return deadline && new Date(deadline) <= new Date();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-display tracking-widest text-foreground">CAREERS MANAGEMENT</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage job openings, deadlines, and position profiles.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Post Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Job Posting' : 'Create Job Posting'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField 
                  control={form.control} 
                  name="title" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Senior Metallurgist" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField 
                    control={form.control} 
                    name="department" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. Production" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField 
                    control={form.control} 
                    name="type" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                
                <FormField 
                  control={form.control} 
                  name="location" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Phuentsholing, Bhutan" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="description" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="h-32 resize-y" {...field} placeholder="Describe the role and responsibilities..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                {/* Deadline Field */}
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
                              ) : (
                                <span>Pick a date (optional)</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString() || null)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground">
                        Jobs will auto-hide after this date. Leave empty for no deadline.
                      </div>
                    </FormItem>
                  )}
                />

                {/* Attachment Upload Section - TOR / Position Profile */}
                <FormField
                  control={form.control}
                  name="attachment_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        TOR / Position Profile (Optional)
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {/* Current Attachment Display */}
                          {currentAttachment && (
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                              <div className="flex items-center gap-3">
                                <File className="h-8 w-8 text-primary" />
                                <div>
                                  <div className="font-medium text-sm text-foreground">
                                    {currentAttachment.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Click to download
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={currentAttachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                                <button
                                  type="button"
                                  onClick={handleRemoveAttachment}
                                  className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Upload Button */}
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className="flex-1"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {isUploading ? 'Uploading...' : (currentAttachment ? 'Replace Document' : 'Upload Document')}
                            </Button>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Supported formats: PDF, DOC, DOCX. Max size: 10MB
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField 
                  control={form.control} 
                  name="is_active" 
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <div className="text-sm text-muted-foreground">Visible on careers page</div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} 
                />
                
                <div className="pt-4 flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsOpen(false);
                      setCurrentAttachment(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading || isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Post Job')}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading careers...</div>
        ) : careers?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No careers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Position</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Attachment</th>
                  <th className="px-6 py-4 font-semibold">Deadline</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {careers?.map((item) => {
                  const expired = isJobExpired(item.deadline);
                  const hasAttachment = item.attachment_url && item.attachment_name;
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.title}</div>
                        <div className="text-muted-foreground text-xs">{item.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {item.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground capitalize">
                        {item.type?.replace('-', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hasAttachment ? (
                          <a
                            href={item.attachment_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="truncate max-w-[100px]">{item.attachment_name}</span>
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">No attachment</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.deadline ? (
                          <span className={expired ? 'text-destructive' : 'text-muted-foreground'}>
                            {format(new Date(item.deadline), 'MMM d, yyyy')}
                            {expired && ' (Expired)'}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No deadline</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          expired ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          item.is_active ? 'bg-primary/10 text-primary border-primary/20' : 
                          'bg-muted text-muted-foreground border-border'
                        }`}>
                          {expired ? 'Expired' : item.is_active ? 'Open' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive" 
                          onClick={() => handleDelete(item.id, item.attachment_url)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}