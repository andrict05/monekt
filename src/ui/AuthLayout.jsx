import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../features/auth/useUser';
import toast from 'react-hot-toast';

function AuthLayout() {
  const navigate = useNavigate();
  const { user, isPending, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isPending && isAuthenticated) {
      toast.success(`Welcome back, ${user.user_metadata.fullName}`);
      navigate('/');
    }
  }, [isPending, isAuthenticated]);

  return isAuthenticated ? (
    <Navigate to='/' />
  ) : (
    <>
      <section className='flex h-screen flex-1 flex-col items-center justify-center bg-slate-950 py-10'>
        <Outlet />
      </section>
    </>
  );
}

export default AuthLayout;
