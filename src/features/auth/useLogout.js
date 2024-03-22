import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseLogoutUser } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logout,
    error,
    isPending: isLoggingOut,
  } = useMutation({
    mutationFn: supabaseLogoutUser,
    mutationKey: ['authenticated-user'],
    onSettled: () => {
      toast.error('You have been logged out.');
      queryClient.setQueryData(['authenticated-user'], null);
      navigate('/signin');
    },
  });

  return {
    logout,
    error,
    isLoggingOut,
  };
}
