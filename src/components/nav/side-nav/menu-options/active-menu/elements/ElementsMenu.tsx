import { IElementType } from '@/types/elements.type';
import { nanoid } from 'nanoid';
import { BsCircle } from 'react-icons/bs';
import { BiRectangle } from 'react-icons/bi';
import { useEditorSore } from '@/store';

const ElementsMenu = () => {
  const addElement = useEditorSore(state => state.addElement);

  const addElements = (type: string) => {
    addElement(IElementType.SHAPE, {
      position: { x: 40, y: 60 },
      type: IElementType.SHAPE,
      startFrame: 0,
      endFrame: 100,
      id: nanoid(),
      size: {
        width: 250,
        height: 200,
      },
      layer: 0,
    });
  };
  return (
    <>
      <div
        className='w-14 h-12 ml-3 bg-slate-400 border border-slate-300 flex items-center cursor-pointer justify-center'
        onClick={() => {
          addElements('shape');
        }}>
        <BiRectangle />
      </div>
      <div
        className='w-14 h-12 ml-3 bg-slate-400 border border-slate-300 flex items-center cursor-pointer justify-center'
        onClick={() => {
          addElements('shape');
        }}>
        <BsCircle />
      </div>
    </>
  );
};

export default ElementsMenu;
