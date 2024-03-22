import { useMutation } from '@tanstack/react-query';
import { supabaseSignupUser } from '../../services/apiAuth';

export function useSignup() {
  const {
    mutate: signup,
    error: signupError,
    isPending: isSigningUp,
  } = useMutation({
    mutationFn: ({ email, password, fullName, username }) =>
      supabaseSignupUser({ email, password, fullName, username }),
    mutationKey: ['authenticated-user'],
  });

  return { signup, signupError, isSigningUp };
}
