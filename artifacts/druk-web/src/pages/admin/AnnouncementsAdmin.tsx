import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload, X, GripVertical } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Announcement } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const announcementSchema = z.object({
  title: z.string().min(2, 'Title required'),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(10, 'Content too short'),
  images: z.array(z.string()).default([]),
  is_published: z.boolean().default(false),
  published_at: z.string().nullable().optional()
});

// Image upload function
async function uploadImages(files: FileList, folder: string = 'announcements'): Promise<string[]> {
  const uploadedUrls: string[] = [];
  
  for (const file of Array.from(files)) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} is larger than 5MB`);
      continue;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} is not an image`);
      continue;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
      continue;
    }
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);
    
    uploadedUrls.push(urlData.publicUrl);
  }
  
  return uploadedUrls;
}

async function deleteImage(imageUrl: string): Promise<void> {
  const path = imageUrl.split('/public/images/')[1];
  if (!path) return;
  
  const { error } = await supabase.storage
    .from('images')
    .remove([path]);
  
  if (error) {
    console.error('Delete error:', error);
  }
}

export default function AnnouncementsAdmin() {
  const { data: announcements, isLoading, refetch } = useAnnouncements();
  const createItem = useCreateAnnouncement();
  const updateItem = useUpdateAnnouncement();
  const deleteItem = useDeleteAnnouncement();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { 
      title: '', 
      excerpt: '', 
      content: '', 
      images: [],
      is_published: false, 
      published_at: null 
    }
  });

  const handleEdit = (item: Announcement) => {
    setEditingId(item.id);
    setImagePreviews(item.images || []);
    form.reset({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content,
      images: item.images || [],
      is_published: item.is_published,
      published_at: item.published_at
    });
    setIsOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setImagePreviews([]);
    form.reset({ 
      title: '', 
      excerpt: '', 
      content: '', 
      images: [],
      is_published: false, 
      published_at: null 
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Create previews
      const previews: string[] = [];
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          setImagePreviews([...previews]);
        };
        reader.readAsDataURL(file);
      }

      // Upload to Supabase
      const uploadedUrls = await uploadImages(files, 'announcements');
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, ...uploadedUrls]);
      
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (index: number) => {
    const currentImages = form.getValues('images') || [];
    const imageToRemove = currentImages[index];
    
    if (imageToRemove) {
      await deleteImage(imageToRemove);
    }
    
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', newImages);
    setImagePreviews(newImages);
    toast.info('Image removed');
  };

  const onSubmit = async (data: z.infer<typeof announcementSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...data,
        published_at: data.is_published && !data.published_at 
          ? new Date().toISOString() 
          : data.published_at,
        excerpt: data.excerpt || null,
        images: data.images || []
      };

      if (editingId) {
        // Get old announcement to delete removed images
        const oldItem = announcements?.find(a => a.id === editingId);
        if (oldItem?.images) {
          const removedImages = oldItem.images.filter(
            (oldImg: string) => !data.images?.includes(oldImg)
          );
          for (const img of removedImages) {
            await deleteImage(img);
          }
        }
        
        await updateItem.mutateAsync({ id: editingId, data: payload });
        toast.success('Announcement updated successfully!');
      } else {
        await createItem.mutateAsync(payload);
        toast.success('Announcement created successfully!');
      }
      
      setIsOpen(false);
      setImagePreviews([]);
      refetch();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error?.message || 'Failed to save announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, images?: string[]) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      try {
        // Delete all associated images
        if (images) {
          for (const img of images) {
            await deleteImage(img);
          }
        }
        await deleteItem.mutateAsync(id);
        toast.success('Announcement deleted successfully!');
        refetch();
      } catch (error: any) {
        console.error('Delete error:', error);
        toast.error(error?.message || 'Failed to delete announcement');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-display tracking-widest text-foreground">NEWS & ANNOUNCEMENTS</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage public company updates with images.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField 
                  control={form.control} 
                  name="title" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Q4 Financial Results Announced" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="excerpt" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="resize-none h-16" 
                          {...field} 
                          value={field.value || ''} 
                          placeholder="Brief summary of the announcement..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="content" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[200px] resize-y" 
                          {...field} 
                          placeholder="Write the full announcement details here..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                {/* Image Upload Section */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Images
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {/* Image Gallery */}
                          {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {imagePreviews.map((url, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="h-32 w-full rounded-md object-cover border border-border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                  <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                                    {index + 1}
                                  </div>
                                </div>
                              ))}
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
                              {isUploading ? 'Uploading...' : 'Upload Images'}
                            </Button>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>

                          {field.value && field.value.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {field.value.length} image(s) uploaded
                            </div>
                          )}
                          
                          <div className="text-xs text-muted-foreground">
                            Supported formats: JPG, PNG, WEBP. Max size: 5MB each. You can select multiple images.
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField 
                  control={form.control} 
                  name="is_published" 
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Status</FormLabel>
                        <div className="text-sm text-muted-foreground">Make visible on public site</div>
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
                      setImagePreviews([]);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading || isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Publish Post')}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading announcements...</div>
        ) : announcements?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No announcements found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Images</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {announcements?.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{item.title}</div>
                      <div className="text-muted-foreground text-xs truncate max-w-[300px]">
                        {item.excerpt || item.content.substring(0, 60) + '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.images && item.images.length > 0 ? (
                        <div className="flex -space-x-2">
                          {item.images.slice(0, 3).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover border-2 border-background"
                            />
                          ))}
                          {item.images.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                              +{item.images.length - 3}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">No images</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.is_published ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'
                      }`}>
                        {item.is_published ? 'Published' : 'Draft'}
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
                        onClick={() => handleDelete(item.id, item.images)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}