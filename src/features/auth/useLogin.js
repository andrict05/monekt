import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseLoginUser } from '../../services/apiAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: login,
    error: loginError,
    data,
    isPending: isLoggingIn,
  } = useMutation({
    mutationFn: ({ email, password }) => supabaseLoginUser({ email, password }),
    mutationKey: ['user'],
    onSuccess: (data) => {
      toast.success('Successfully logged in!');
      queryClient.setQueryData(['user'], data);
      navigate('/');
    },
    onError: (error) => {
      toast.error(`Error occured while logging in. ${error.message}`);
    },
  });

  return { login, data, loginError, isLoggingIn };
}
