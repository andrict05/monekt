import { useQuery } from '@tanstack/react-query';
import { supabaseGetPosts } from '../../services/apiPosts';

export function usePosts() {
  const {
    data,
    isPending: isPostsPending,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: supabaseGetPosts,
    retry: 1,
  });

  return { data, isPostsPending, error };
}
