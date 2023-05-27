import { useState } from 'react';
import SideMenu from './menu';
import MenuOptions from './menu-options';

const SideNav = () => {
  return (
    <div className='flex w-full'>
      <div className='flex w-2/12 h-full bg-slate-700 items-center justify-center'>
        <SideMenu />
      </div>
      {/* side menu selected options */}
      <MenuOptions />
    </div>
  );
};

export default SideNav;
