import { Children, createContext, useContext, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';

const MenuContext = createContext();

function MenuProvider({ children }) {
  const [openId, setOpenId] = useState('');
  const [position, setPosition] = useState(null);

  const closeMenu = () => setOpenId('');
  const openMenu = (id) => setOpenId(id);

  return (
    <MenuContext.Provider
      value={{ openId, position, setPosition, closeMenu, openMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

function Menu({ children }) {
  return <div className='flex  items-center justify-center '>{children}</div>;
}

function Toggle({ children, id }) {
  const { openMenu, openId, closeMenu } = useContext(MenuContext);

  function handleClick(e) {
    e.stopPropagation();
    openId === id ? closeMenu() : openMenu(id);
  }

  return <button onClick={handleClick}>{children}</button>;
}

function OptionList({ children, id }) {
  const { openId, closeMenu } = useContext(MenuContext);
  const ref = useOutsideClick(closeMenu, false);

  if (openId !== id) return null;

  return (
    <div
      className='absolute right-0 top-14 rounded-md bg-slate-700 px-2 py-1'
      ref={ref}>
      {children}
    </div>
  );
}

MenuProvider.Menu = Menu;
MenuProvider.Toggle = Toggle;
MenuProvider.OptionList = OptionList;

export default MenuProvider;
