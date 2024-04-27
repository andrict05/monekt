import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  HiMiniUser,
  HiPencilSquare,
  HiUser,
  HiUserCircle,
} from 'react-icons/hi2';

import { useUpdateProfileSettings } from '@/lib/react-query/queries';
import { useState } from 'react';

function ProfileSettings() {
  const user = useSelector((state) => state.user.currentUser);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm();
  const { updateProfileSettings, isPending } = useUpdateProfileSettings();
  const [avatar, setAvatar] = useState(user.avatar || '/assets/logo.png');

  function handleProfileUpdate({ avatar, bio }) {
    updateProfileSettings(
      { avatar, bio, user },
      {
        onSuccess: (data) => {
          setAvatar(data.avatar);
        },
      }
    );
  }
  return (
    <form className='space-y-8' onSubmit={handleSubmit(handleProfileUpdate)}>
      <h1 className='text-2xl font-bold'>Profile Settings</h1>
      <label className='input input-lg input-bordered flex items-center gap-2'>
        <HiUser className='h-6 w-6' />
        Username
        <input
          type='text'
          className='grow text-slate-100 hover:cursor-not-allowed'
          defaultValue={user.username}
          disabled
        />
      </label>
      <div>
        <div className='flex items-center gap-8'>
          <div className='mask mask-squircle inline-block rounded-lg bg-neutral p-4'>
            {avatar ? (
              <img
                src={avatar}
                alt={user.fullName}
                className='mask mask-squircle h-32 w-32 object-cover'
              />
            ) : (
              <HiMiniUser className='mask mask-squircle h-32 w-32 bg-neutral' />
            )}
          </div>
          <div>
            <p className='mb-2 text-lg font-semibold'>
              Upload new profile picture
            </p>
            <input
              type='file'
              className='file-input file-input-bordered file-input-primary w-full max-w-xs'
              accept='.png, .jpg, .jpeg'
              {...register('avatar')}
            />
            <p className='text-xs text-neutral-500'>
              Accepts only .png and .jpg file formats
            </p>
          </div>
        </div>
      </div>
      <div>
        <h2 className='mb-4 text-xl font-bold'>Biography</h2>
        <textarea
          className='textarea textarea-primary textarea-lg w-full resize-none text-slate-100'
          defaultValue={user?.bio || ''}
          rows={4}
          {...register('bio')}></textarea>
      </div>
      <div>
        <div className='divider'></div>
        <button className='btn btn-primary btn-lg w-full' disabled={isPending}>
          <HiPencilSquare className='h-6 w-6' />
          <span>Update profile</span>
        </button>
      </div>
    </form>
  );
}

export default ProfileSettings;
