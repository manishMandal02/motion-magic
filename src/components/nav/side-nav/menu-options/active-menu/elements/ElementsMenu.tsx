import { IElementTypes } from '@/types/editor/elements.type';
import { nanoid } from 'nanoid';
import { BsCircle } from 'react-icons/bs';
import { BiRectangle } from 'react-icons/bi';
import { useEditorSore } from '@/store';

const ElementsMenu = () => {
  const addElement = useEditorSore((state) => state.addElement);

  const addElements = (type: string) => {
    addElement({
      position: { x: 40, y: 60 },
      type: IElementTypes.SHAPE,
      startFrame: 0,
      endFrame: 4,
      id: nanoid(),
      size: {
        width: 250,
        height: 200,
      },
    });
  };
  return (
    <>
      <div
        className='w-14 h-12 ml-3 bg-slate-400 border border-slate-300 flex items-center cursor-pointer justify-center'
        onClick={() => {
          addElements('shape');
        }}
      >
        <BiRectangle />
      </div>
      <div
        className='w-14 h-12 ml-3 bg-slate-400 border border-slate-300 flex items-center cursor-pointer justify-center'
        onClick={() => {
          addElements('shape');
        }}
      >
        <BsCircle />
      </div>
    </>
  );
};

export default ElementsMenu;
