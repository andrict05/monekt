import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import LeftSidebar from './LeftSidebar';
import { useUser } from '../features/auth/useUser';
import { BeatLoader } from 'react-spinners';

function AppLayout() {
  const navigate = useNavigate();
  const { user, isPending, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, isPending]);

  if (isPending)
    return (
      <div className='flex h-screen w-screen items-center justify-center bg-slate-950'>
        <BeatLoader color='#f0f0ff' size={20} />;
      </div>
    );

  return (
    isAuthenticated && (
      <div className='h-screen w-full text-white md:flex'>
        <LeftSidebar />
        <section className='flex h-full w-6/12 flex-1 overflow-y-auto bg-slate-950 p-14 '>
          <Outlet />
        </section>
        <section className='h-screen w-4/12 bg-slate-900 p-14'>
          <h1 className='text-2xl'>Top Creators</h1>
        </section>
      </div>
    )
  );
}

export default AppLayout;
