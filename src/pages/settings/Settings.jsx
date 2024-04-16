import { HiCog8Tooth, HiMiniUser, HiPaintBrush, HiUser } from 'react-icons/hi2';
import { NavLink, Outlet } from 'react-router-dom';

function Settings() {
  return (
    <div className='mx-auto flex h-full w-full py-8 lg:w-4/5 xl:w-3/5'>
      <div className='w-1/4 p-8'>
        <ul className='space-y-2 text-xl'>
          <NavItem to='/settings/profile'>
            <HiUser />
            <span>Profile</span>
          </NavItem>
          <NavItem to='/settings/security'>
            <HiCog8Tooth />
            <span>Security</span>
          </NavItem>
        </ul>
      </div>
      <div className='divider divider-neutral divider-horizontal'></div>
      <div className='w-3/4 p-8'>
        <Outlet />
      </div>
    </div>
  );
}

function NavItem({ to, children, ...props }) {
  return (
    <NavLink to={to} className='block'>
      <li className='flex items-center gap-1 rounded-md p-4 hover:bg-neutral [.active_&]:bg-neutral'>
        {children}
      </li>
    </NavLink>
  );
}

export default Settings;
