import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload, X, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Product } from '@/types/database';
import { uploadImage, deleteImage } from '@/lib/upload'; // Import from upload.ts
// OR if using utils.ts:
// import { uploadImage, deleteImage } from '@/lib/utils';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().min(10, 'Description too short'),
  category: z.string().min(2, 'Category required'),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean().default(true)
});

export default function ProductsAdmin() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: { 
      name: '', 
      description: '', 
      category: '', 
      image_url: null, 
      is_active: true 
    }
  });

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setPreviewUrl(product.image_url || null);
    form.reset({
      name: product.name,
      description: product.description,
      category: product.category,
      image_url: product.image_url,
      is_active: product.is_active
    });
    setIsOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setPreviewUrl(null);
    form.reset({ 
      name: '', 
      description: '', 
      category: '', 
      image_url: null, 
      is_active: true 
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }

    setIsUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const imageUrl = await uploadImage(file, 'products');
      form.setValue('image_url', imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    const currentImageUrl = form.getValues('image_url');
    if (currentImageUrl) {
      deleteImage(currentImageUrl).catch(console.error);
    }
    form.setValue('image_url', null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Image removed');
  };

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      if (editingId) {
        // Get the old product to delete its image if it's being replaced
        const oldProduct = products?.find(p => p.id === editingId);
        if (oldProduct?.image_url && oldProduct.image_url !== data.image_url) {
          await deleteImage(oldProduct.image_url);
        }
        updateProduct.mutate({ id: editingId, product: data }, {
          onSuccess: () => {
            setIsOpen(false);
            setPreviewUrl(null);
            toast.success('Product updated successfully!');
          }
        });
      } else {
        createProduct.mutate(data, {
          onSuccess: () => {
            setIsOpen(false);
            setPreviewUrl(null);
            toast.success('Product created successfully!');
          }
        });
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string, imageUrl?: string | null) => {
    if (confirm('Are you sure you want to delete this product?')) {
      if (imageUrl) {
        try {
          await deleteImage(imageUrl);
        } catch (error) {
          console.error('Failed to delete image:', error);
        }
      }
      deleteProduct.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-display tracking-widest text-foreground">PRODUCT MANAGEMENT</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage catalog and specifications.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField 
                  control={form.control} 
                  name="name" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Ferrosilicon 75%" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="category" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Ferrosilicon" />
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
                        <Textarea className="resize-none h-24" {...field} placeholder="Describe the product..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />

                {/* Image Upload Section */}
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Product Image
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {/* Preview */}
                          {previewUrl && (
                            <div className="relative">
                              <img
                                src={previewUrl}
                                alt="Product preview"
                                className="h-48 w-full rounded-md object-cover border border-border"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
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
                              {isUploading ? 'Uploading...' : 'Choose Image'}
                            </Button>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>

                          {/* Show existing image URL if no preview */}
                          {field.value && !previewUrl && (
                            <div className="text-sm text-muted-foreground truncate">
                              Current image: {field.value.split('/').pop()}
                            </div>
                          )}
                          
                          <div className="text-xs text-muted-foreground">
                            Supported formats: JPG, PNG, WEBP. Max size: 5MB
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
                        <div className="text-sm text-muted-foreground">Visible on public site</div>
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
                      setPreviewUrl(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {editingId ? 'Save Changes' : 'Create Product'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading products...</div>
        ) : products?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Image</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products?.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-muted-foreground text-xs truncate max-w-[250px]">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover border border-border"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted/30 flex items-center justify-center border border-border">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        product.is_active ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'
                      }`}>
                        {product.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive" 
                        onClick={() => handleDelete(product.id, product.image_url)}
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