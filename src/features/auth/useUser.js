import { useQuery } from '@tanstack/react-query';
import { supabaseGetUser } from '../../services/apiAuth';

export function useUser() {
  const {
    data: user,
    isPending,
    error: userError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: supabaseGetUser,
  });

  return {
    user,
    userError,
    isPending,
    isAuthenticated: user?.role === 'authenticated',
  };
}
