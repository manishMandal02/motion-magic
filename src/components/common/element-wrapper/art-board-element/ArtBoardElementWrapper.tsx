import { useEditorSore } from '@/store';
import { IElementPosition, IElementSize } from '@/types/editor/elements.type';
import { ReactNode, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import ResizablePoints from './ResizablePoints';
import ResizableLines from './ResizableLines';

type Props = {
  id: string;
  children: ReactNode;
  size: IElementSize;
  position: IElementPosition;
  setSize: (size: IElementSize) => void;
  setPosition: (pos: IElementPosition) => void;
};

const ArtBoardElementWrapper = ({ children, id, size, position, setPosition, setSize }: Props) => {
  const { width, height } = size;
  const { x, y } = position;

  // global states
  const videoScale = useEditorSore((state) => state.scale);
  const selectedEl = useEditorSore((state) => state.selectedEl);
  const setSelectedEl = useEditorSore((state) => state.setSelectedEl);

  const isSelected = selectedEl?.id == id;

  const onSelectEl = () => {
    if (isSelected) {
      //TODO: finding a different solution where clicking on the selected el will not unSelect it
      setSelectedEl(null);
      // return;
    } else {
      setSelectedEl(id);
    }
  };

  //TODO: handling click outside the element
  // const handleClickOutside = (ev: MouseEvent) => {
  //   const elementWrapper = document.getElementById('element-wrapper');
  //   if (!elementWrapper) return;
  //   if (elementWrapper.contains(ev.target as Node)) {
  //     console.log('Clicked Inside');
  //   } else {
  //     console.log('Clicked Outside / Elsewhere');
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);

  //   //cleanup
  //   () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  return (
    <>
      <Rnd
        size={{ width, height }}
        position={{ x, y }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setSize({
            width: Number(ref.style.width.slice(0, -2)),
            height: Number(ref.style.height.slice(0, -2)),
          });
          setPosition({
            x: position.x,
            y: position.y,
          });
        }}
        scale={videoScale}
        className={`
        box-border hover:outline hover:outline-[3px] hover:outline-emerald-500 hover:outline-offset-2 hover:rounded-[0.02rem]
        `}
        resizeHandleComponent={
          isSelected
            ? {
                topRight: <ResizablePoints pos='topRight' />,
                topLeft: <ResizablePoints pos='topLeft' />,
                bottomLeft: <ResizablePoints pos='bottomRight' />,
                bottomRight: <ResizablePoints pos='bottomLeft' />,
              }
            : {}
        }
        bounds={'parent'}
        enableResizing={isSelected}
      >
        <div
          className={`w-full h-full relative 
      
        ${isSelected ? ' outline outline-[3px] outline-emerald-500 outline-offset-2 rounded-[0.02rem]' : ''}
        `}
          onClick={onSelectEl}
          id={'element-wrapper'}
        >
          {isSelected ? <ResizableLines /> : null}
          {children}
        </div>
      </Rnd>
    </>
  );
};

export default ArtBoardElementWrapper;
