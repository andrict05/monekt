import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { useQueryClient } from '@tanstack/react-query';
import { useLogin } from '@/lib/react-query/queries';

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
        className='flex flex-col items-center space-y-6 text-slate-50'
        onSubmit={handleSubmit(handleLogin)}>
        <header className='mb-4 text-center'>
          <div className='mb-14  flex items-center justify-center gap-2'>
            <h1 className='text-3xl font-semibold text-primary'>monekt</h1>
          </div>
          <h1 className='mb-4 text-4xl font-bold tracking-tight'>
            Log in to your account
          </h1>
          <p className='text-xl tracking-wide  text-slate-400'>
            Welcome back! Please enter your details.
          </p>
        </header>
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
              disabled={isLoggingIn}
              placeholder='Password'
              autoComplete='current-password'
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
          <button disabled={isLoggingIn} className='btn btn-primary w-full'>
            {isLoggingIn ? <BeatLoader color='#f8faf9' size={10} /> : 'Log in'}
          </button>
        </div>
        <div>
          <span className='mr-2 inline-block text-lg'>
            Don&apos;t have an account?
          </span>
          <Link to='/signup' className='link link-primary'>
            Sign up
          </Link>
        </div>
        <div>
          <span className='mr-2 inline-block text-lg'>
            Forgot your password?
          </span>
          <Link to='/forgot' className='link link-primary'>
            Forgot password
          </Link>
        </div>
      </form>
    </>
  );
}

export default SignInForm;
