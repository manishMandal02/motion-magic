import { useEditorSore } from '@/store';
import { IElementTypes } from '@/types/editor/elements.type';
import { RxText } from 'react-icons/rx';
import { nanoid } from 'nanoid';

const TextMenu = () => {
  const addElement = useEditorSore((state) => state.addElement);

  const addText = () => {
    addElement({
      value: 'Manish Mandal',
      fontSize: 42,
      position: { x: 10, y: 10 },
      type: IElementTypes.TEXT,
      timeFrame: {
        startFrame: 30,
        endFrame: 60,
      },
      id: nanoid(),
      size: {
        width: 250,
        height: 200,
      },
    });
  };
  return (
    <div>
      <div
        className='w-14 h-12 bg-slate-400 border border-slate-300 flex items-center cursor-pointer justify-center'
        onClick={() => {
          addText();
        }}
      >
        <RxText />
      </div>
    </div>
  );
};

export default TextMenu;
