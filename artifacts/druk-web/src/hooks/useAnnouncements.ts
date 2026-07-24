import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as announcementService from '@/services/announcements';
import { Announcement } from '@/types/database';

const placeholderAnnouncements: Announcement[] = [
  { id: '1', title: 'Phase 2 Furnace Capacity Expansion Completed', content: 'We have successfully completed the expansion of our primary smelting furnace...', excerpt: 'Expanding our production capacity by 40% to meet regional demand.', published_at: new Date().toISOString(), is_published: true, created_at: new Date().toISOString() },
  { id: '2', title: 'ISO 9001:2015 Quality Certification Achieved', content: 'Druk Enviroklenes is proud to announce we have achieved ISO 9001:2015 certification...', excerpt: 'Validating our commitment to world-class manufacturing standards.', published_at: new Date(Date.now() - 86400000 * 5).toISOString(), is_published: true, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export function useAnnouncements(publishedOnly = false) {
  return useQuery({
    queryKey: ['announcements', publishedOnly],
    queryFn: async () => {
      try {
        const data = publishedOnly ? await announcementService.getPublishedAnnouncements() : await announcementService.getAnnouncements();
        return data.length > 0 ? data : placeholderAnnouncements.filter(a => publishedOnly ? a.is_published : true);
      } catch (err) {
        return placeholderAnnouncements.filter(a => publishedOnly ? a.is_published : true);
      }
    }
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementService.createAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] })
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Announcement> }) => announcementService.updateAnnouncement(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] })
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementService.deleteAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] })
  });
}
