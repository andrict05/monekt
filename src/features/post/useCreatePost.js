import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseCreatePost } from '../../services/apiPosts';
import { useNavigate } from 'react-router-dom';

export function useCreatePost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: createPost,
    error,
    isPending,
  } = useMutation({
    mutationKey: ['new-post'],
    mutationFn: supabaseCreatePost,
    onSettled: () => {
      queryClient.invalidateQueries('posts');
      navigate('/');
    },
  });

  return { createPost, isPending, error };
}
