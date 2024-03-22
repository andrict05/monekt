import { useMutation } from '@tanstack/react-query';
import { supabaseLoginUser } from '../../services/apiAuth';

export function useLogin() {
  const {
    mutate: login,
    error: loginError,
    data,
    isPending: isLoggingIn,
  } = useMutation({
    mutationFn: ({ email, password }) => supabaseLoginUser({ email, password }),
    mutationKey: ['authenticated-user'],
  });

  return { login, data, loginError, isLoggingIn };
}
