
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Design } from './types';

export const useDesignStatusData = () => {
  return useQuery({
    queryKey: ['admin-designs-by-status'],
    queryFn: async (): Promise<Design[]> => {
      const { data, error } = await supabase
        .from('designs')
        .select(`
          id,
          title,
          status,
          created_at,
          file_url,
          user_id,
          design_mockups(id),
          design_selections(id),
          profiles(first_name, last_name)
        `)
        .neq('status', 'consumed') // Filter out consumed designs
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        return [];
      }

      return data || [];
    },
  });
};
