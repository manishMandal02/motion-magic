import { useEditorStore } from '@/store';
import SelectedElOptions from './selected-el-options';
import ActiveMenuOptions from './active-menu';

const MenuOptions = () => {
  const selectedEl = useEditorStore(state => state.selectedEl);

  if (selectedEl) {
    return (
      <>
        <div className='flex text-white w-10/12 bg-slate-800 items-start p-2'>
          <SelectedElOptions selectedEl={selectedEl} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className='flex text-white w-10/12 bg-slate-800 items-start p-2'>
          <ActiveMenuOptions />
        </div>
      </>
    );
  }
};

export default MenuOptions;
