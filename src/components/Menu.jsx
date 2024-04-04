import { createContext, useContext, useState } from 'react';

import { useOutsideClick } from '../hooks/useOutsideClick';
import { HiEllipsisVertical } from 'react-icons/hi2';

const MenuContext = createContext();

function Menu({ children }) {
  const [opened, setOpened] = useState('');

  const openMenu = (list) =>
    setOpened((opened) => (opened === list ? '' : list));
  const closeMenu = () => setOpened(false);

  const value = {
    opened,
    openMenu,
    closeMenu,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

function MenuToggle({ toggles }) {
  const { openMenu } = useContext(MenuContext);

  const handleClick = (e) => {
    if (openMenu !== toggles) e.stopPropagation();
    openMenu(toggles);
  };

  return (
    <button onClick={handleClick}>
      <HiEllipsisVertical size={22} />
    </button>
  );
}

function MenuList({ children, list, detectOutside = true, ...props }) {
  const { opened, closeMenu } = useContext(MenuContext);
  const wrapperRef = useOutsideClick(closeMenu, detectOutside, false);

  if (opened !== list) return null;

  return (
    <ul
      ref={wrapperRef}
      className={`absolute right-2 top-20 z-50 rounded-md bg-slate-700`}>
      {children}
    </ul>
  );
}

function MenuItem({ children, onClick, closesMenu = true, className = '' }) {
  const { closeMenu } = useContext(MenuContext);

  const handleClick = (e) => {
    onClick?.(e);
    closesMenu && closeMenu();
  };

  return (
    <li
      className={
        'flex items-center justify-start gap-2 rounded-md p-2 hover:bg-slate-500' +
        ' ' +
        className
      }
      onClick={handleClick}>
      {children}
    </li>
  );
}

export { Menu, MenuToggle, MenuList, MenuItem };
