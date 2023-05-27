import type { IElement } from '@/types/editor/elements.type';
import type { SideMenuItems } from '@/types/editor/settings.type';
import type { IconType } from 'react-icons/lib';

type Props = {
  Icon: IconType;
  label: SideMenuItems;
  isActive?: boolean;
  onClick: (menuItem: SideMenuItems) => void;
  selectedEl: IElement | null;
  setSelectedEl: (id: string | null) => void;
};

const MenuItems = ({ Icon, label, isActive, onClick, setSelectedEl, selectedEl }: Props) => {
  const isElSelected = !!selectedEl;
  return (
    <>
      <div
        className={`flex flex-col items-center justify-center text-slate-100 pr-1 w-full hover:bg-slate-800 py-2.5 cursor-pointer
        ${isActive && !isElSelected ? 'bg-slate-800' : ''}
        `}
        onClick={() => {
          onClick(label);
          setSelectedEl(null);
        }}
      >
        <Icon size={24} className='scale-110' />
        <p className='text-sm mt-1 '>{label}</p>
      </div>
    </>
  );
};

export default MenuItems;
