import { supabase } from '@/lib/supabase';
import { CompanyInfo } from '@/types/database';

export async function getCompanyInfo() {
  const { data, error } = await supabase.from('company_information').select('*');
  if (error) throw error;
  
  // Convert array to object
  return data.reduce((acc: Record<string, string>, item: CompanyInfo) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

export async function updateCompanyInfo(key: string, value: string) {
  const { error } = await supabase.from('company_information').upsert({ key, value }, { onConflict: 'key' });
  if (error) throw error;
}
