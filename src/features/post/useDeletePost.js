import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { supabaseDeletePost } from '../../services/apiPosts';

export function useDeletePost() {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
    mutationKey: ['deleted-post'],
    mutationFn: supabaseDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      toast.success('Your post has been deleted!');
    },
  });

  return { deletePost, isDeleting: isPending };
}
