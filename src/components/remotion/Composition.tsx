import { useEditorStore } from '@/store';
import { IElementType } from '@/types/elements.type';
import Rectangle from '../art-board/elements/shapes/rectangle';
import BasicText from '../art-board/elements/text/basic-text';

export const MyComposition = () => {
  const allElements = useEditorStore(state => state.elements);
  const setElPos = useEditorStore(state => state.setElPos);
  const setElSize = useEditorStore(state => state.setElSize);

  return (
    <div className='bg-white w-full h-full'>
      {allElements.map(el => {
        if (el.type === IElementType.SHAPE) {
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
        if (el.type === IElementType.TEXT) {
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
