import { useEditorSore } from '@/store';
import { IElementTypes } from '@/types/editor/elements.type';
import Rectangle from '../art-board/elements/shapes/rectangle';
import BasicText from '../art-board/elements/text/basic-text';

export const MyComposition = () => {
  const allElements = useEditorSore((state) => state.elements);
  const setElPos = useEditorSore((state) => state.setElPos);
  const setElSize = useEditorSore((state) => state.setElSize);

  return (
    <div className='bg-white w-full h-full'>
      {allElements.map((el) => {
        if (el.type === IElementTypes.SHAPE) {
          return (
            <Rectangle
              key={el.id}
              id={el.id}
              position={el.position}
              size={el.size}
              setPosition={({ x, y }) => setElPos(el.id, { x, y })}
              setSize={({ width, height }) => setElSize(el.id, { width, height })}
            />
          );
        }
        if (el.type === IElementTypes.TEXT) {
          return (
            <BasicText
              key={el.id}
              id={el.id}
              fontSize={el.fontSize}
              position={el.position}
              size={el.size}
              value={el.value}
              setPosition={({ x, y }) => setElPos(el.id, { x, y })}
              setSize={({ width, height }) => setElSize(el.id, { width, height })}
            />
          );
        }
      })}
    </div>
  );
};
