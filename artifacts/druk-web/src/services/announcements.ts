import { supabase } from '@/lib/supabase';
import { Announcement } from '@/types/database';

export async function getAnnouncements() {
  const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Announcement[];
}

export async function getPublishedAnnouncements() {
  const { data, error } = await supabase.from('announcements').select('*').eq('is_published', true).order('published_at', { ascending: false });
  if (error) throw error;
  return data as Announcement[];
}

export async function createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('announcements').insert(announcement).select().single();
  if (error) throw error;
  return data as Announcement;
}

export async function updateAnnouncement(id: string, announcement: Partial<Announcement>) {
  const { data, error } = await supabase.from('announcements').update(announcement).eq('id', id).select().single();
  if (error) throw error;
  return data as Announcement;
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
}
