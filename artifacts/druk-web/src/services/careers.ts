import { supabase } from '@/lib/supabase';
import { Career } from '@/types/database';

export async function getCareers() {
  const { data, error } = await supabase.from('careers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Career[];
}

export async function getActiveCareers() {
  const { data, error } = await supabase.from('careers').select('*').eq('is_active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return data as Career[];
}

export async function createCareer(career: Omit<Career, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('careers').insert(career).select().single();
  if (error) throw error;
  return data as Career;
}

export async function updateCareer(id: string, career: Partial<Career>) {
  const { data, error } = await supabase.from('careers').update(career).eq('id', id).select().single();
  if (error) throw error;
  return data as Career;
}

export async function deleteCareer(id: string) {
  const { error } = await supabase.from('careers').delete().eq('id', id);
  if (error) throw error;
}
