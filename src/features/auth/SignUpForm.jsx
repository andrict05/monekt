import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

import { useSignup } from './useSignup';

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
  const { signup, signupError, isSigningUp } = useSignup();
  const navigate = useNavigate();

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

    signup({ email, password, fullName, username });
  }

  return (
    <>
      <form
        className='flex flex-col items-center space-y-6  text-slate-50'
        onSubmit={handleSubmit(handleSignup)}>
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
            Create a new account
          </h1>
          <p className='text-xl tracking-wide  text-slate-400'>
            To use monekt, please enter your details.
          </p>
        </header>
        <div>
          <div className='flex justify-between'>
            <Label>Full name</Label>
            <span>{errors?.fullName?.message}</span>
          </div>
          <Input
            type='text'
            name='fullName'
            disabled={isSigningUp}
            {...register('fullName', {
              required: 'Please enter your full name',
            })}
          />
        </div>
        <div>
          <div className='flex justify-between'>
            <Label>Username</Label>
            <span>{errors?.username?.message}</span>
          </div>
          <Input
            type='text'
            name='username'
            disabled={isSigningUp}
            {...register('username', {
              required: 'Please enter your username',
            })}
          />
        </div>
        <div>
          <div className='flex justify-between'>
            <Label>Email</Label>
            <span>{errors?.email?.message}</span>
          </div>
          <Input
            type='text'
            name='email'
            disabled={isSigningUp}
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
            <Label>Password</Label>
            <span>{errors?.password?.message}</span>
          </div>
          <Input
            type='password'
            name='password'
            disabled={isSigningUp}
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
          <div className='flex justify-between'>
            <Label>Confirm password</Label>
            <span>{errors?.confirmPassword?.message}</span>
          </div>
          <Input
            type='password'
            name='confirmPassword'
            disabled={isSigningUp}
            {...register('confirmPassword', {
              required: 'Please enter password',
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match',
            })}
          />
        </div>
        <div>
          <button
            disabled={isSigningUp}
            className='h-12 w-[30rem] rounded-md bg-blue-600 font-semibold tracking-wide text-slate-50'>
            {isSigningUp ? <BeatLoader color='#f8faf9' size={10} /> : 'Sign up'}
          </button>
        </div>
        <div>
          <span className='mr-2 inline-block text-lg'>Have an account?</span>
          <Link to='/signin' className='text-blue-600 hover:text-blue-400'>
            Log in
          </Link>
        </div>
      </form>
    </>
  );
}

export default SignUpForm;
