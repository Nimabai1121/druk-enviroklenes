import { supabase } from '@/lib/supabase';

export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage.from('images').upload(filePath, file);
  if (error) throw error;

  const { data } = supabase.storage.from('images').getPublicUrl(filePath);
  return data.publicUrl;
}
