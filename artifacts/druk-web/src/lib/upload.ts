// lib/upload.ts
import { supabase } from './supabase';

export async function uploadImage(
  file: File,
  folder: string = 'products'
): Promise<string> {
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('images') // Your bucket name
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  // Extract path from URL
  // URL format: https://[project-id].supabase.co/storage/v1/object/public/images/products/123.jpg
  const path = imageUrl.split('/public/images/')[1];
  if (!path) {
    console.warn('Could not extract path from URL:', imageUrl);
    return;
  }
  
  const { error } = await supabase.storage
    .from('images')
    .remove([path]);
  
  if (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete image');
  }
}