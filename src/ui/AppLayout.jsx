import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import {
  HiBookmark,
  HiCog8Tooth,
  HiDocumentPlus,
  HiHome,
  HiMiniUser,
  HiPhoto,
  HiUser,
  HiUserGroup,
} from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import Loader from '@/ui/Loader';
import FullPage from '@/ui/FullPage';
import supabase from '@/services/supabase';
import { setCurrentUser } from '@/userSlice';

function AppLayout() {
  const [loaded, setLoaded] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setLoaded(true);
    }
  }, [user]);

  async function handleLogout() {
    toast.success('Logged out successfully.');
    await supabase.auth.signOut();
    dispatch(setCurrentUser(null));
  }

  return (
    <div className='flex h-dvh w-dvw flex-col'>
      <header className='flex shrink-0 grow-0 basis-auto justify-center bg-base-300'>
        <div className='navbar w-full text-[0.4rem] lg:w-11/12 xl:w-11/12 2xl:w-10/12'>
          <div className='navbar-start '>
            <NavLink to='/' className='btn btn-ghost text-xl text-primary'>
              monekt
            </NavLink>
          </div>
          <div className='navbar-center'>
            <ul className='menu menu-horizontal menu-lg items-center px-1'>
              <li>
                <NavLink to='/'>
                  <HiHome className='h-6 w-6' />
                  <span className='hidden sm:inline-block'>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/explore'>
                  <HiPhoto className='h-6 w-6' />
                  <span className='hidden sm:inline-block'>Explore</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/people'>
                  <HiUserGroup className='h-6 w-6' />
                  <span className='hidden sm:inline-block'>People</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/saved'>
                  <HiBookmark className='h-6 w-6' />
                  <span className='hidden sm:inline-block'>Saved</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className='navbar-end '>
            <NavLink to='/create-post' className='link-accent mr-4'>
              <button className='btn btn-accent btn-sm'>
                <HiDocumentPlus className='h-6 w-6' />
                <span className='hidden text-xs lg:inline-block lg:text-sm'>
                  Create post
                </span>
              </button>
            </NavLink>
            {loaded ? (
              <div className='dropdown dropdown-end'>
                <div
                  tabIndex={0}
                  role='button'
                  className='avatar btn btn-circle btn-ghost online hover:bg-transparent'>
                  <div className='mask mask-squircle w-16  '>
                    <img
                      alt={user?.fullName}
                      src={user?.avatar || '/assets/default-user.png'}
                      className='mask mask-squircle'
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className='menu dropdown-content menu-lg z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow'>
                  <li>
                    <NavLink to={`/profile/${user?.id}`}>
                      <HiUser className='h-6 w-6' />
                      <span>Profile</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/settings'>
                      <HiCog8Tooth className='h-6 w-6' />
                      <span>Settings</span>
                    </NavLink>
                  </li>
                  <div className='divider my-3'></div>
                  <button className='btn  btn-error ' onClick={handleLogout}>
                    Logout
                  </button>
                </ul>
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </header>
      <main className='shrink grow basis-auto overflow-auto bg-base-200'>
        {loaded && !!user ? (
          <Outlet />
        ) : (
          <FullPage>
            <Loader />
          </FullPage>
        )}
      </main>
    </div>
  );
}

export default AppLayout;
