import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseSignupUser } from '../../services/apiAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useSignup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: signup,
    error: signupError,
    isPending: isSigningUp,
  } = useMutation({
    mutationFn: ({ email, password, fullName, username }) =>
      supabaseSignupUser({ email, password, fullName, username }),
    mutationKey: ['user'],
    onSuccess: (data) => {
      toast.success('Account created successfully');
      queryClient.setQueryData(['user'], data.user);
      navigate('/');
    },
    onError: (error) => {
      toast.error(`Error occured while creating an account. ${error.message}`);
    },
  });

  return { signup, signupError, isSigningUp };
}
