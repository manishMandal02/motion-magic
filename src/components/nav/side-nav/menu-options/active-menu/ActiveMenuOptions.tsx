import { useEditorStore } from '@/store';
import Elements from './elements';
import TextMenu from './text';
import SettingsMenu from './settings';

const ActiveMenuOptions = () => {
  const activeMenu = useEditorStore(state => state.activeMenu);

  switch (activeMenu) {
    case 'Settings': {
      return <SettingsMenu />;
    }

    case 'Elements': {
      return <Elements />;
    }
    default:
      return (
        <>
          <TextMenu />
        </>
      );
  }

  if (activeMenu === 'Settings') {
    return (
      <>
        <Elements />
      </>
    );
  }
};

export default ActiveMenuOptions;
