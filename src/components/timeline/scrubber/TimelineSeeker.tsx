import { Ref, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Rnd, RndDragCallback } from 'react-rnd';

type Props = {
  frameWidth: number;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  lastFrame: number;
  timelineWidth: number;
  timelineScrollTop: number;
};

const SCRUBBER_Y_AXIS_POS = 6;

const TimelineSeeker = ({
  currentFrame,
  frameWidth,
  setCurrentFrame,
  timelineWidth,
  timelineScrollTop,
}: Props) => {
  const [position, setPosition] = useState({ x: 0, y: SCRUBBER_Y_AXIS_POS });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame || 0;

    setPosition({ x: currentPlaybackPosition, y: SCRUBBER_Y_AXIS_POS });
  }, [frameWidth, currentFrame]);

  const handleDrag: RndDragCallback = useCallback(
    (_ev, data) => {
      const frame = Math.round(data.x / frameWidth);

      setPosition({ x: data.x, y: SCRUBBER_Y_AXIS_POS });
      setCurrentFrame(frame);
    },
    [frameWidth, setCurrentFrame]
  );

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
    setPosition({ y: timelineScrollTop + 6, x: position.x });
  }, [timelineScrollTop, position.x]);

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
          top: 0,
          zIndex: 100,
          pointerEvents: 'auto',
          float: 'left',
        }}
        bounds={'parent'}
        className={`${!isDragging ? 'transition-all duration-100' : ''}`}
      >
        <div className='h-[27vh] sticky top-0  bg-transparent CC_dashedBorder w-[1.6px]'>
          <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
        </div>
      </Rnd>
    </>
  );
};

export default TimelineSeeker;
