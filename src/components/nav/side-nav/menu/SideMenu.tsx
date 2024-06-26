import { AiTwotoneSetting } from 'react-icons/ai';
import { FaShapes } from 'react-icons/fa';
import { RxText } from 'react-icons/rx';
import MenuItems from './MenuItems';
import { IconType } from 'react-icons/lib';
import { useEditorStore } from '@/store';
import { SideMenuItems } from '@/types/settings.type';

type SideMenuItemsWithIcons = {
  label: SideMenuItems;
  Icon: IconType;
};

const sideMenuItemsWithIcons: SideMenuItemsWithIcons[] = [
  { label: 'Settings', Icon: AiTwotoneSetting },
  {
    label: 'Elements',
    Icon: FaShapes,
  },
  {
    label: 'Text',
    Icon: RxText,
  },
];

const SideMenu = () => {
  const selectedEl = useEditorStore(state => state.selectedEl);
  const setSelectedEl = useEditorStore(state => state.setSelectedEl);
  const setActiveMenu = useEditorStore(state => state.setActiveMenu);
  const activeMenu = useEditorStore(state => state.activeMenu);

  return (
    <div className='h-full w-full bg-gray-900 flex flex-col items-center justify-start'>
      {sideMenuItemsWithIcons.map(item => (
        <MenuItems
          key={item.label}
          Icon={item.Icon}
          label={item.label}
          isActive={activeMenu === item.label}
          onClick={setActiveMenu}
          selectedEl={selectedEl}
          setSelectedEl={setSelectedEl}
        />
      ))}
    </div>
  );
};

export default SideMenu;
