import { ReactNode, Ref, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { IElementFrameDuration } from '@/types/elements.type';
import debounce from '@/utils/common/debounce';
import throttle from '@/utils/common/throttle';

type Props = {
  id: string;
  children: ReactNode;
  startFrame: number;
  endFrame: number;
  frameWidth: number;
  width: number;
  height: number;
  translateX: number;
  updateElFrameDuration: (id: string, duration: IElementFrameDuration) => void;
};

const TimelineElementWrapper = ({
  id,
  children,
  startFrame,
  endFrame,
  frameWidth,
  updateElFrameDuration,
  width,
  height,
  translateX,
}: Props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizingORDragging, setIsResizingORDragging] = useState(false);

  useEffect(() => {
    setPosition({ x: translateX, y: 0 });
  }, [translateX]);

  //
  const handleResizeLeft = debounce((deltaWidth: number) => {
    const newStartFrame = Math.max(0, startFrame - Math.round(deltaWidth / frameWidth));

    updateElFrameDuration(id, {
      startFrame: newStartFrame,
      endFrame,
    });
  }, 200);

  //
  const handleResizeRight = (deltaWidth: number) => {
    const newEndFrame = Math.max(startFrame, endFrame + Math.round(deltaWidth / frameWidth));

    updateElFrameDuration(id, {
      endFrame: newEndFrame,
      startFrame,
    });
  };

  const handleDrag = (deltaX: number) => {
    const newStartFrame = Math.max(0, startFrame + Math.round(deltaX / frameWidth));

    const newEndFrame = newStartFrame + (endFrame - startFrame);

    updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame });
  };

  return (
    <>
      <Rnd
        size={{ width, height }}
        position={{ x: position.x, y: 5 }}
        onDrag={(_e, d) => {
          setPosition({ x: d.x, y: d.y });
          handleDrag(d.x - position.x);
        }}
        onDragStart={() => {
          setIsResizingORDragging(true);
        }}
        onResizeStart={() => {
          setIsResizingORDragging(true);
        }}
        onDragStop={() => {
          setIsResizingORDragging(false);
        }}
        onResize={throttle((_e, direction, ref: HTMLDivElement) => {
          const newWidth = ref.clientWidth;

          if (direction === 'left') {
            handleResizeLeft(newWidth - width);
          }
          if (direction === 'right') {
            handleResizeRight(newWidth - width);
          }
        }, 500)}
        onResizeStop={() => {
          setIsResizingORDragging(false);
        }}
        dragAxis='x'
        dragGrid={[frameWidth, 0]}
        resizeGrid={[frameWidth, frameWidth]}
        // scale={videoScale}
        className={`hover:shadow-sm rounded-md hover:shadow-slate-400 transform-gpu transition-all ${
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
        }}>
        {children}
      </Rnd>
    </>
  );
};

export default TimelineElementWrapper;
