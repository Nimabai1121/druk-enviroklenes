import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as careerService from '@/services/careers';
import { Career } from '@/types/database';

const placeholderCareers: Career[] = [
  { id: '1', title: 'Senior Metallurgist', department: 'Production', location: 'Phuentsholing, Bhutan', type: 'full-time', description: 'Lead quality control and alloy composition optimization.', is_active: true, created_at: new Date().toISOString() },
  { id: '2', title: 'Plant Operations Manager', department: 'Operations', location: 'Phuentsholing, Bhutan', type: 'full-time', description: 'Oversee daily manufacturing operations and safety compliance.', is_active: true, created_at: new Date().toISOString() },
  { id: '3', title: 'Industrial Electrician', department: 'Maintenance', location: 'Phuentsholing, Bhutan', type: 'full-time', description: 'Maintain high-voltage furnace systems and plant electrical infrastructure.', is_active: true, created_at: new Date().toISOString() },
];

export function useCareers(activeOnly = false) {
  return useQuery({
    queryKey: ['careers', activeOnly],
    queryFn: async () => {
      try {
        const data = activeOnly ? await careerService.getActiveCareers() : await careerService.getCareers();
        return data.length > 0 ? data : placeholderCareers.filter(c => activeOnly ? c.is_active : true);
      } catch (err) {
        return placeholderCareers.filter(c => activeOnly ? c.is_active : true);
      }
    }
  });
}

export function useCreateCareer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: careerService.createCareer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['careers'] })
  });
}

export function useUpdateCareer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Career> }) => careerService.updateCareer(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['careers'] })
  });
}

export function useDeleteCareer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: careerService.deleteCareer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['careers'] })
  });
}
