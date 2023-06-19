import { IElementPosition } from '@/types/elements.type';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Rnd, RndDragCallback } from 'react-rnd';

type Props = {
  frameWidth: number;
  durationInFrames: number;
  handleDrag: RndDragCallback;
  positionX: number;
  positionY: number;
};

const SEEKER_Y_AXIS_POS = -6;

const TimelineSeeker = ({ frameWidth, durationInFrames, positionX, handleDrag, positionY }: Props) => {

console.log("🚀 ~ file: TimelineSeeker.tsx:17 ~ TimelineSeeker ~ durationInFrames:", durationInFrames);


  console.log("🚀 ~ file: TimelineSeeker.tsx:17 ~ TimelineSeeker ~ frameWidth:", frameWidth);

  // seeker bounds (max-right)
  const seekerBounds = useMemo(
    () => ({
      top: 0,
      right: durationInFrames * frameWidth,
      bottom: 0,
      left: 0,
    }),
    [durationInFrames, frameWidth]
  );

  const seekerRef = useRef<Rnd>(null);

  useEffect(() => {
    if (!seekerRef) return;
    seekerRef.current?.setState({
      bounds: { ...seekerBounds },
    });
  }, [seekerBounds]);

  return (
    <>
      <Rnd
        position={{ x: positionX, y: positionY }}
        onDrag={handleDrag}
        ref={seekerRef}
        dragAxis='x'
        dragGrid={[frameWidth, 0]}
        enableResizing={false}
        style={{
          position: 'absolute',
          zIndex: 150,
          pointerEvents: 'auto',
        }}
        bounds={'parent'}
      >
        <div className='h-[28vh]  top-0  bg-transparent CC_dashedBorder w-[1.6px]'>
          <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
        </div>
      </Rnd>
    </>
  );
};

export default TimelineSeeker;
