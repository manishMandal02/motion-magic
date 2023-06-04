import { ReactNode, useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import ResizablePoints from '../art-board-element/ResizablePoints';
import { IElement, IElementFrameDuration } from '@/types/elements.type';

type Props = {
  id: string;
  children: ReactNode;
  startFrame: number;
  endFrame: number;
  singleFrameWidth: number;
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
  singleFrameWidth,
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

  const handleResizeLeft = (deltaWidth: number) => {
    const newStartFrame = Math.max(0, startFrame - Math.round(deltaWidth / singleFrameWidth));

    updateElFrameDuration(id, {
      startFrame: newStartFrame,
      endFrame,
    });
  };

  const handleResizeRight = (deltaWidth: number) => {
    const newEndFrame = Math.max(startFrame, endFrame + Math.round(deltaWidth / singleFrameWidth));
    updateElFrameDuration(id, {
      endFrame: newEndFrame,
      startFrame,
    });
  };

  const rndContainer = useRef<Rnd>(null);

  const handleDrag = (deltaX: number) => {
    const newStartFrame = Math.max(0, startFrame + Math.round(deltaX / singleFrameWidth));

    const newEndFrame = newStartFrame + (endFrame - startFrame);

    updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame });
  };

  return (
    <>
      <Rnd
        ref={rndContainer}
        size={{ width, height }}
        position={{ x: position.x, y: 5 }}
        onDragStart={() => {
          setIsResizingORDragging(true);
        }}
        onResizeStart={() => {
          setIsResizingORDragging(true);
        }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
          handleDrag(d.x - position.x);
          // TODO: update el startFrame * endFrame, also check for track changes
          setIsResizingORDragging(false);
        }}
        onResizeStop={(e, direction, ref, delta) => {
          if (direction === 'left') {
            handleResizeLeft(delta.width);
          }
          if (direction === 'right') {
            handleResizeRight(delta.width);
          }
          setIsResizingORDragging(false);
        }}
        dragAxis='x'
        dragGrid={[singleFrameWidth, 0]}
        resizeGrid={[singleFrameWidth, singleFrameWidth]}
        // scale={videoScale}
        className={`hover:shadow-sm rounded-md hover:shadow-slate-400 transform-gpu transition-all ${
          !isResizingORDragging ? 'duration-[280ms]' : 'duration-0'
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
