import { ReactNode, useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import ResizablePoints from '../art-board-element/ResizablePoints';
import { IElement, IElementFrameDuration } from '@/types/editor/elements.type';

type Props = {
  id: string;
  children: ReactNode;
  startFrame: number;
  endFrame: number;
  singleFrameWidth: number;
  width: number;
  translateX: number;
  updateElFrameDuration: (id: string, duration: IElementFrameDuration) => void;
};

const TIMELINE_ELEMENT_HEIGHT = 40;

const TimelineElementWrapper = ({
  id,
  children,
  startFrame,
  endFrame,
  singleFrameWidth,
  updateElFrameDuration,
  width,
  translateX,
}: Props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x: translateX, y: 0 });
  }, [translateX]);

  const handleResizeLeft = (deltaWidth: number) => {
    const newStartFrame = Math.max(0, startFrame - Math.round(deltaWidth / singleFrameWidth));

    console.log(
      '🚀 ~ file: TimelineElementWrapper.tsx:38 ~ handleResizeLeft ~ newStartFrame:',
      newStartFrame
    );

    console.log('🚀 ~ file: TimelineElementWrapper.tsx:38 ~ handleResizeLeft ~ deltaWidth:', deltaWidth);

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

  const handleDrag = (deltaX: number) => {
    const newStartFrame = Math.max(0, startFrame + Math.round(deltaX / singleFrameWidth));

    const newEndFrame = newStartFrame + (endFrame - startFrame);

    updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame });
  };

  const wrapperRef = useRef<Rnd>(null);

  useEffect(() => {
    if (!wrapperRef) return;
  }, []);

  console.log('🚀 ~ file: TimelineElementWrapper.tsx:32 ~ translateXValue:', position.x);

  return (
    <>
      <Rnd
        ref={wrapperRef}
        size={{ width, height: TIMELINE_ELEMENT_HEIGHT }}
        position={{ x: position.x, y: position.y }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
          handleDrag(d.x - position.x);
          // TODO: update el startFrame * endFrame, also check for track changes
        }}
        onResizeStop={(e, direction, ref, delta) => {
          if (direction === 'left') {
            handleResizeLeft(delta.width);
          }
          if (direction === 'right') {
            handleResizeRight(delta.width);
          }
        }}
        dragAxis='x'
        dragGrid={[singleFrameWidth, TIMELINE_ELEMENT_HEIGHT]}
        // scale={videoScale}
        className={`hover:shadow-sm hover:shadow-slate-400 transform-gpu`}
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
