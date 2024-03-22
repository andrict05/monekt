import { Outlet } from 'react-router-dom';

import LeftSidebar from './LeftSidebar';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import FullPage from './FullPage';
import { useSelector } from 'react-redux';

function AppLayout() {
  const [loaded, setLoaded] = useState(false);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (user) {
      setLoaded(true);
    }
  }, [user]);

  return !loaded ? (
    <FullPage>
      <Loader />
    </FullPage>
  ) : (
    <div className='h-screen w-full text-white md:flex'>
      <LeftSidebar />
      <section className='flex h-full w-6/12 flex-1 overflow-y-auto bg-slate-950 p-14 '>
        <Outlet />
      </section>
      <section className='h-screen w-4/12 bg-slate-900 p-14'>
        <h1 className='text-2xl'>Top Creators</h1>
      </section>
    </div>
  );
}

export default AppLayout;
