import { ReactNode, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { IElementFrameDuration } from '@/types/elements.type';
import throttle from 'raf-throttle';

type Props = {
  children: ReactNode;
  frameWidth: number;
  width: number;
  height: number;
  translateX: number;
  updateElFrameDuration: (id: string, duration: IElementFrameDuration) => void;
  handleDrag: (deltaX: number) => void;
  handleResize: (deltaWidth: number, direction: 'left' | 'right') => void;
  resetRefLines: () => void;
};

const ELEMENT_POS_Y = 10;

const TimelineElementWrapper = ({
  children,
  frameWidth,
  width,
  height,
  translateX,
  handleDrag,
  handleResize,
  resetRefLines,
}: Props) => {
  const [position, setPosition] = useState({ x: 0, y: ELEMENT_POS_Y });
  const [isResizingORDragging, setIsResizingORDragging] = useState(false);

  useEffect(() => {
    setPosition({ x: translateX, y: ELEMENT_POS_Y });
  }, [translateX]);

  return (
    <>
      <Rnd
        size={{ width, height }}
        position={{ x: position.x, y: ELEMENT_POS_Y }}
        onDrag={throttle((_e, d) => {
          setPosition({ x: d.x, y: d.y });
          handleDrag(d.x - position.x);
        })}
        onDragStart={() => {
          setIsResizingORDragging(true);
        }}
        onResizeStart={() => {
          setIsResizingORDragging(true);
        }}
        onDragStop={() => {
          setIsResizingORDragging(false);
          resetRefLines();
        }}
        // @ts-ignore
        onResize={throttle((_e, direction, ref: HTMLDivElement) => {
          const newWidth = ref.clientWidth;

          if (direction === 'left') {
            handleResize(newWidth - width, 'left');
          }
          if (direction === 'right') {
            handleResize(newWidth - width, 'right');
          }
        })}
        onResizeStop={() => {
          setIsResizingORDragging(false);
          resetRefLines();
        }}
        dragAxis='x'
        dragGrid={[frameWidth, 0]}
        // resizeGrid={[frameWidth, frameWidth]}
        // scale={videoScale}
        className={`hover:shadow-sm  rounded-md hover:shadow-slate-400 transform-gpu  ${
          !isResizingORDragging ? 'duration-300' : 'duration-0'
        }`}
        style={{
          position: 'absolute',
          // transform: `translate(${translateXValue}px, 0px)`,
        }}
        bounds={'parent'}
        enableResizing={{
          top: false,
          topLeft: false,
          topRight: false,
          right: true,
          left: true,
          bottom: false,
          bottomLeft: false,
          bottomRight: false,
        }}
      >
        {children}
      </Rnd>
    </>
  );
};

export default TimelineElementWrapper;
