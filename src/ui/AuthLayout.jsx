import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <section className='flex h-screen flex-1 flex-col items-center justify-center bg-slate-950 py-10'>
      <Outlet />
    </section>
  );
}

export default AuthLayout;
