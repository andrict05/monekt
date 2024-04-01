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
      <section
        className='no-scrollbar flex h-screen w-6/12 flex-1
overflow-y-scroll bg-slate-950 p-14 '>
        <Outlet />
      </section>
    </div>
  );
}

export default AppLayout;
