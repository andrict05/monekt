import { Link, NavLink } from 'react-router-dom';
import {
  HiArrowRightOnRectangle,
  HiOutlineBookmark,
  HiOutlineCog,
  HiOutlineCog6Tooth,
  HiOutlineCog8Tooth,
  HiOutlineDocumentPlus,
  HiOutlineHome,
  HiOutlinePhoto,
  HiOutlineUserGroup,
  HiUserGroup,
} from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useLogout } from '@/lib/react-query/queries';

function LeftSidebar() {
  const user = useSelector((state) => state.user.currentUser);
  const { logout, isLoggingOut } = useLogout();

  function handleLogout(e) {
    e.preventDefault();
    logout();
  }

  return (
    !isLoggingOut && (
      <aside className='flex h-screen w-2/12 flex-col bg-slate-900 p-10'>
        <nav className='flex h-full flex-col gap-10'>
          <div className='flex items-center gap-4'>
            <img
              src='/assets/logo.png'
              alt='Monekt logo'
              className='inline-block h-10'
            />
            <span className='text-3xl font-bold tracking-wide text-white'>
              Monekt
            </span>
          </div>
          <div>
            <Link
              to={`/profile/${user.id}`}
              className='flex items-center gap-2 text-xl'>
              <img
                className='h-16 w-16 rounded-full'
                src={user.avatar || '/assets/logo.png'}
                alt='avatar'
              />
              <div className='flex flex-col justify-center'>
                <span className='font-semibold'>{user.fullName}</span>
                <span className='font-light text-slate-300'>
                  @{user.username}
                </span>
              </div>
            </Link>
          </div>
          <ul className='flex flex-col gap-4'>
            <li>
              <NavLink
                to='/'
                className='flex items-center gap-3 rounded-md p-4 text-xl font-semibold hover:bg-blue-400 [&.active]:bg-blue-500'>
                <HiOutlineHome
                  size='2rem'
                  className='text-blue-600 [.active_&]:text-blue-100'
                />
                <span>Home</span>
              </NavLink>
            </li>
            <li className=''>
              <NavLink
                to='/explore'
                className='flex items-center gap-3 rounded-md p-4 text-xl font-semibold hover:bg-blue-400 [&.active]:bg-blue-500'>
                <HiOutlinePhoto
                  size='2rem'
                  className='text-blue-600 [.active_&]:text-blue-100'
                />
                <span>Explore</span>
              </NavLink>
            </li>
            <li className=''>
              <NavLink
                to='/people'
                className='flex items-center gap-3 rounded-md p-4 text-xl font-semibold hover:bg-blue-400 [&.active]:bg-blue-500'>
                <HiOutlineUserGroup
                  size='2rem'
                  className='text-blue-600 [.active_&]:text-blue-100'
                />
                <span>People</span>
              </NavLink>
            </li>
            <li className=''>
              <NavLink
                to='/saved'
                className='flex items-center gap-3 rounded-md p-4 text-xl font-semibold hover:bg-blue-400 [&.active]:bg-blue-500'>
                <HiOutlineBookmark
                  size='2rem'
                  className='text-blue-600 [.active_&]:text-blue-100'
                />
                <span>Saved</span>
              </NavLink>
            </li>
            <li className=''>
              <NavLink
                to='/create-post'
                className='flex items-center gap-3 rounded-md p-4 text-xl font-semibold hover:bg-blue-400 [&.active]:bg-blue-500'>
                <HiOutlineDocumentPlus
                  size='2rem'
                  className='text-blue-600 [.active_&]:text-blue-100'
                />
                <span>Create post</span>
              </NavLink>
            </li>
          </ul>
          <div className='mt-auto'>
            <NavLink
              to='/account'
              className='flex items-center gap-3 rounded-md p-4 text-xl font-semibold hover:bg-blue-400 [&.active]:bg-blue-500'>
              <HiOutlineCog8Tooth
                size='2rem'
                className='text-blue-600 [.active_&]:text-blue-100'
              />
              <span>Account</span>
            </NavLink>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className='group  flex w-full items-center gap-3 rounded-md p-4 text-xl font-semibold hover:bg-red-400 [&.active]:bg-blue-500'>
              <HiArrowRightOnRectangle
                size='1.6rem'
                className='text-blue-600 group-hover:text-red-600'
              />
              <span className='group-hover:text-red-50'>Log out</span>
            </button>
          </div>
        </nav>
      </aside>
    )
  );
}

export default LeftSidebar;
