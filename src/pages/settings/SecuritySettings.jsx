import { HiEnvelope, HiKey, HiLockClosed } from 'react-icons/hi2';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { useUserEmail } from '@/lib/react-query/queries';
import supabase from '@/services/supabase';
import Loader from '@/ui/Loader';
import { setCurrentUser } from '@/userSlice';

function SecuritySettings() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();
  const { email, emailLoading } = useUserEmail();
  const dispatch = useDispatch();

  async function handleSecuritySettingsUpdate({ password, confirmPassword }) {
    if (!password || !confirmPassword || password !== confirmPassword) return;

    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) return toast.error(error.message);
    toast.success('Password updated successfully. Please sign in again.');
    dispatch(setCurrentUser(null));
    await supabase.auth.signOut();
  }

  return (
    <form
      className='space-y-8'
      onSubmit={handleSubmit(handleSecuritySettingsUpdate)}>
      <h1 className='text-2xl font-bold'>Security Settings</h1>
      <label className='input input-lg input-bordered flex items-center gap-2'>
        <HiEnvelope className='h-6 w-6' />
        Email
        {!emailLoading ? (
          <input
            type='text'
            className='grow text-slate-100 hover:cursor-not-allowed'
            defaultValue={email}
            disabled
          />
        ) : (
          <Loader />
        )}
      </label>
      <div className='space-y-4 rounded-lg bg-base-100 p-4'>
        <label className='input input-lg input-bordered input-primary flex items-center gap-2'>
          <HiKey className='h-6 w-6' />
          New Password
          <input
            type='password'
            className='grow text-slate-100'
            {...register('password', {
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              required: true,
            })}
          />
        </label>

        <label className='input input-lg input-bordered input-primary flex items-center gap-2'>
          <HiKey className='h-6 w-6' />
          Confirm New Password
          <input
            type='password'
            className='grow text-slate-100'
            {...register('confirmPassword', {
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match.',
            })}
          />
        </label>
        {errors?.password && (
          <p className='text-md pl-2 text-error'>{errors.password.message}</p>
        )}
        {errors?.confirmPassword && (
          <p className='text-md pl-2 text-error'>
            {errors.confirmPassword.message}
          </p>
        )}

        <div>
          <div className='divider'></div>
          <button className='btn btn-primary btn-lg w-full'>
            <HiLockClosed className='h-6 w-6' />
            <span>Change password</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default SecuritySettings;
