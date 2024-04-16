import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import supabase from '@/services/supabase';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPasswordForm() {
  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate();

  async function handleRecover({ email }) {
    if (!email) {
      toast.error('Please provide your credentials.');
      return;
    }
    let { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings/security`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Password recovery email sent.');
    navigate('/');
  }

  return (
    <>
      <form
        className='flex flex-col items-center space-y-6  text-slate-50'
        onSubmit={handleSubmit(handleRecover)}>
        <header className='mb-4 text-center'>
          <div className='mb-14  flex items-center justify-center gap-2'>
            <h1 className='text-3xl font-semibold text-primary'>monekt</h1>
          </div>
          <h1 className='mb-4 text-4xl font-bold tracking-tight'>
            Recover your password
          </h1>
          <p className='text-xl tracking-wide  text-slate-400'>
            Please enter your email address.
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
          <button className='btn btn-primary w-full'>
            Send recovery email
          </button>
        </div>
        <Link className='link link-primary text-center' to='/signin'>
          Back to login
        </Link>
      </form>
    </>
  );
}

export default ForgotPasswordForm;
