import { useEffect, useState } from 'react';
import Loader from './Loader';
import FullPage from './FullPage';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import {
  HiBookmark,
  HiCog8Tooth,
  HiDocumentPlus,
  HiHome,
  HiPhoto,
  HiUser,
  HiUserGroup,
} from 'react-icons/hi2';

function AppLayout() {
  const [loaded, setLoaded] = useState(false);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (user) {
      setLoaded(true);
    }
  }, [user]);

  return (
    <div className='flex h-screen w-screen flex-col'>
      <header className='bg-base-300 flex shrink-0 grow-0 basis-auto justify-center'>
        <div className='navbar w-8/12'>
          <div className='navbar-start '>
            <NavLink to='/' className='btn btn-ghost text-primary text-xl'>
              monekt
            </NavLink>
          </div>
          <div className='navbar-center'>
            <ul className='menu menu-lg menu-horizontal items-center px-1'>
              <li>
                <NavLink to='/'>
                  <HiHome className='h-6 w-6' />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/explore'>
                  <HiPhoto className='h-6 w-6' />
                  <span>Explore</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/people'>
                  <HiUserGroup className='h-6 w-6' />
                  <span>People</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/saved'>
                  <HiBookmark className='h-6 w-6' />
                  <span>Saved</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className='navbar-end '>
            <NavLink to='/create-post' className='link-accent mr-4'>
              <button className='btn btn-sm btn-accent'>
                <HiDocumentPlus className='h-6 w-6' />
                <span className='text-sm'>Create post</span>
              </button>
            </NavLink>
            {loaded ? (
              <div className='dropdown dropdown-end'>
                <div
                  tabIndex={0}
                  role='button'
                  className='btn btn-ghost btn-circle online avatar '>
                  <div className='mask mask-squircle w-16  '>
                    <img
                      alt='Tailwind CSS Navbar component'
                      src={user.avatar || '/assets/logo.png'}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className='menu menu-lg dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'>
                  <li>
                    <NavLink to={`/profile/${user.id}`}>
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
                  <button className='btn  btn-error '>Logout</button>
                </ul>
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </header>
      <main className='bg-base-200 shrink grow basis-auto overflow-auto'>
        {loaded ? (
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
