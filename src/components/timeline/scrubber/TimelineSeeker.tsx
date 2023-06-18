import throttle from '@/utils/common/throttle';
import { Ref, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Rnd, RndDragCallback } from 'react-rnd';

type Props = {
  frameWidth: number;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  lastFrame: number;
  timelineWidth: number;
  timelineScrollLeft: number;
};

const SEEKER_Y_AXIS_POS = 6;

const TimelineSeeker = ({
  currentFrame,
  frameWidth,
  setCurrentFrame,
  timelineWidth,
  timelineScrollLeft,
}: Props) => {
  const [position, setPosition] = useState({ x: 0, y: SEEKER_Y_AXIS_POS });

  console.log('🚀 ~ file: TimelineSeeker.tsx:25 ~ position.x:', position.x);

  const [prevScrollX, setPrevScrollX] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame || 0;

    setPosition({ x: currentPlaybackPosition - prevScrollX, y: SEEKER_Y_AXIS_POS });
  }, [frameWidth, currentFrame, prevScrollX]);

  console.log('🚀 ~ file: TimelineSeeker.tsx:37 ~ prevScrollX:', prevScrollX);

  // handle drag seeker
  const handleDrag: RndDragCallback = (_ev, data) => {
    const currentXPos = data.x + prevScrollX;

    const frame = Math.round(currentXPos / frameWidth);

    console.log('🚀 ~ file: TimelineSeeker.tsx:95 ~ data:', data);

    setPosition({ x: data.x, y: SEEKER_Y_AXIS_POS });
    setCurrentFrame(frame);
  };

  const seekerBounds = {
    top: 0,
    right: timelineWidth,
    bottom: 0,
    left: 0,
  };

  const seekerRef = useRef<Rnd>(null);

  useEffect(() => {
    if (!seekerRef) return;
    seekerRef.current?.setState({
      bounds: { ...seekerBounds },
    });
  });

  // update position based on timeline-container scroll

  useEffect(() => {
    setIsDragging(true);
    setPosition(prev => ({ y: SEEKER_Y_AXIS_POS, x: prev.x - (timelineScrollLeft - prevScrollX) }));
    setIsDragging(false);
    setPrevScrollX(timelineScrollLeft);
  }, [timelineScrollLeft, prevScrollX]);

  return (
    <>
      <Rnd
        position={{ x: position.x, y: position.y }}
        onDragStart={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        onDrag={handleDrag}
        ref={seekerRef}
        dragAxis='x'
        dragGrid={[frameWidth, 0]}
        enableResizing={false}
        style={{
          position: 'absolute',
          zIndex: 150,
          pointerEvents: 'auto',
          float: 'left',
        }}
        bounds={'parent'}
        className={`${!isDragging ? 'transition-all duration-100' : ''}`}
      >
        <div className='h-[28vh] sticky top-0  bg-transparent CC_dashedBorder w-[1.6px]'>
          <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
        </div>
      </Rnd>
    </>
  );
};

export default TimelineSeeker;
