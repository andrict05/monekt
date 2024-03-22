import { useQuery } from '@tanstack/react-query';
import { supabaseGetAuthenticatedUser } from '../../services/apiAuth';

export function useAuthenticatedUser() {
  const {
    data: authenticatedUser,
    isPending,
    error: authenticatedUserError,
  } = useQuery({
    queryKey: ['authenticated-user'],
    queryFn: supabaseGetAuthenticatedUser,
  });

  return {
    authenticatedUser,
    authenticatedUserError,
    isPending,
    isAuthenticated: authenticatedUser?.role === 'authenticated',
  };
}
