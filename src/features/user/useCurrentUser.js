import { useMutation } from '@tanstack/react-query';
import { supabaseGetCurrentUser } from '../../services/apiUser';
import { useSelector } from 'react-redux';

export function useCurrentUser() {
  const sessionUserId = useSelector((state) => state.user.sessionUserId);

  const { mutate, data, error, isPending } = useMutation({
    mutationKey: ['current-user'],
    mutationFn: async () => await supabaseGetCurrentUser(sessionUserId),
  });

  return { getCurrentUser: mutate, currentUser: data, error, isPending };
}
