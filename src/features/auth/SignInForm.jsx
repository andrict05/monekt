import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { useQueryClient } from '@tanstack/react-query';
import { useLogin } from '@/lib/react-query/queries';

const Input = styled.input`
  width: 30rem;
  height: 3rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: #1f2937;
  color: #d1d5db;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #d1d5db;
  font-size: 1rem;
`;

function SignInForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const { login, isLoggingIn } = useLogin();

  function handleLogin({ email, password }) {
    if (!email || !password) {
      toast.error('Please provide your credentials.');
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success('Successfully logged in!');
          queryClient.setQueryData(['authenticated-user'], data);
          navigate('/');
        },
        onError: (error) => {
          toast.error(`Error occured while logging in. ${error.message}`);
        },
      }
    );
  }

  return (
    <>
      <form
        className='flex flex-col items-center space-y-6  text-slate-50'
        onSubmit={handleSubmit(handleLogin)}>
        <header className='mb-4 text-center'>
          <div className='mb-14  flex items-center justify-center gap-2'>
            <img
              src='assets/logo.png'
              alt='Monekt logo'
              className='inline-block h-10'
            />
            <span className=' text-3xl font-semibold'>Monekt</span>
          </div>
          <h1 className='mb-4 text-4xl font-bold tracking-tight'>
            Log in to your account
          </h1>
          <p className='text-xl tracking-wide  text-slate-400'>
            Welcome back! Please enter your details.
          </p>
        </header>
        <div>
          <div className='flex justify-between'>
            <Label htmlFor='email'>Email</Label>
            <span>{errors?.email?.message}</span>
          </div>
          <Input
            value='tomislav@monekt.com'
            type='text'
            name='email'
            id='email'
            disabled={isLoggingIn}
            autoComplete='email'
            {...register('email', {
              required: 'Please enter your email address',
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
        </div>
        <div>
          <div className='flex justify-between'>
            <Label htmlFor='password'>Password</Label>
            <span>{errors?.password?.message}</span>
          </div>
          <Input
            value='34976100'
            type='password'
            name='password'
            id='password'
            disabled={isLoggingIn}
            autoComplete='current-password'
            {...register('password', {
              required: 'Please enter password',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
            })}
          />
        </div>
        <div>
          <button
            disabled={isLoggingIn}
            className='h-12 w-[30rem] rounded-md bg-blue-600 font-semibold tracking-wide text-slate-50'>
            {isLoggingIn ? <BeatLoader color='#f8faf9' size={10} /> : 'Log in'}
          </button>
        </div>
        <div>
          <span className='mr-2 inline-block text-lg'>
            Don&apos;t have an account?
          </span>
          <Link to='/signup' className='text-blue-600 hover:text-blue-400'>
            Sign up
          </Link>
        </div>
      </form>
    </>
  );
}

export default SignInForm;
