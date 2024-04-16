import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { useQueryClient } from '@tanstack/react-query';
import { useSignup } from '@/lib/react-query/queries';

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

function SignUpForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { signup, isSigningUp } = useSignup();

  const { register, handleSubmit, formState, getValues } = useForm();
  const { errors } = formState;

  function handleSignup({
    email,
    password,
    fullName,
    username,
    confirmPassword,
  }) {
    if (
      !email ||
      !password ||
      !fullName ||
      !username ||
      confirmPassword !== password
    ) {
      toast.error('Please fill in all fields correctly.');
      return;
    }

    signup(
      { email, password, fullName, username },
      {
        onSuccess: (data) => {
          toast.success('Account created successfully');
          queryClient.setQueryData(['authenticated-user'], data.user);
          navigate('/');
        },
        onError: (error) => {
          toast.error(
            `Error occured while creating an account. ${error.message}`
          );
        },
      }
    );
  }

  return (
    <>
      <form
        className='flex flex-col items-center space-y-6  text-slate-50'
        onSubmit={handleSubmit(handleSignup)}>
        <header className='mb-4 text-center'>
          <div className='mb-14  flex items-center justify-center gap-2'>
            <h1 className='text-3xl font-semibold text-primary'>monekt</h1>
          </div>
          <h1 className='mb-4 text-4xl font-bold tracking-tight'>
            Create a new account
          </h1>
          <p className='text-xl tracking-wide  text-slate-400'>
            To use monekt, please enter your details.
          </p>
        </header>
        <div className='w-full'>
          <label className='input input-lg input-bordered input-primary flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-6 w-6 opacity-70'>
              <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
            </svg>
            <input
              type='text'
              className='grow'
              disabled={isSigningUp}
              placeholder='Full name'
              autoComplete='name'
              {...register('fullName', {
                required: 'Please enter your full name',
              })}
            />
          </label>
        </div>
        <div className='w-full'>
          <label className='input input-lg input-bordered input-primary flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-6 w-6 opacity-70'>
              <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
            </svg>
            <input
              type='text'
              className='grow'
              placeholder='Username'
              disabled={isSigningUp}
              autoComplete='username'
              {...register('username', {
                required: 'Please enter your username',
              })}
            />
          </label>
        </div>
        <div className='w-full'>
          <label className='input input-lg input-bordered input-primary flex w-full items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-6 w-6 opacity-70'>
              <path d='M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z' />
              <path d='M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z' />
            </svg>
            <input
              type='text'
              className='w-full grow'
              placeholder='Email'
              disabled={isSigningUp}
              autoComplete='email'
              {...register('email', {
                required: 'Please enter your email address',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
          </label>
        </div>
        <div className='w-full'>
          <label className='input input-lg input-bordered input-primary flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'>
              <path
                fillRule='evenodd'
                d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                clipRule='evenodd'
              />
            </svg>
            <input
              type='password'
              className='grow'
              disabled={isSigningUp}
              placeholder='Password'
              autoComplete='new-password'
              {...register('password', {
                required: 'Please enter password',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
          </label>
        </div>
        <div className='w-full'>
          <label className='input input-lg input-bordered input-primary flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'>
              <path
                fillRule='evenodd'
                d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                clipRule='evenodd'
              />
            </svg>
            <input
              type='password'
              className='grow'
              disabled={isSigningUp}
              placeholder='Confirm password'
              autoComplete='new-password'
              {...register('confirmPassword', {
                required: 'Please enter password',
                validate: (value) =>
                  value === getValues('password') || 'Passwords do not match',
              })}
            />
          </label>
        </div>
        <div className='w-full'>
          <button disabled={isSigningUp} className='btn btn-primary w-full'>
            {isSigningUp ? <BeatLoader color='#f8faf9' size={10} /> : 'Sign up'}
          </button>
        </div>
        <div>
          <span className='mr-2 inline-block text-lg'>Have an account?</span>
          <Link to='/signin' className='link link-primary'>
            Log in
          </Link>
        </div>
      </form>
    </>
  );
}

export default SignUpForm;
