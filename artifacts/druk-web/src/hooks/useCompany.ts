import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as companyService from '@/services/company';

const placeholderCompany = {
  company_name: 'Druk Enviroklenes Pvt. Ltd.',
  tagline: 'Forging Bhutan\'s Industrial Future',
  address: 'Norbugang Industrial Park\nSamtse, Bhutan',
  phone: '+975 17 11 22 33',
  email: 'contact@drukenviro.bt',
  founded_year: '2012',
  about_text: 'Druk Enviroklenes is a premier heavy-industry manufacturer specializing in precision smelting and ferroalloy production.'
};

export function useCompanyInfo() {
  return useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      try {
        const data = await companyService.getCompanyInfo();
        const companyData = Object.keys(data).length > 0 ? { ...placeholderCompany, ...data } : placeholderCompany;
        const normalizedAddress = companyData.address?.toLowerCase().includes('pasakha')
          ? 'Norbugang Industrial Park\nSamtse, Bhutan'
          : companyData.address;

        return {
          ...companyData,
          address: normalizedAddress
        };
      } catch (err) {
        return placeholderCompany;
      }
    }
  });
}

export function useUpdateCompanyInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      await companyService.updateCompanyInfo(key, value);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['company'] })
  });
}
