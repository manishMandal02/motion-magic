import { useEffect, useRef, useState } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

type Props = {
  frameWidth: number;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  timelineTrackScrollableWidth: number;
};

const SEEKER_Y_AXIS_POS = 6;

const TimelineSeeker = ({
  currentFrame,
  frameWidth,
  setCurrentFrame,
  timelineTrackScrollableWidth,
}: Props) => {
  const [position, setPosition] = useState({ x: 0, y: SEEKER_Y_AXIS_POS });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame || 0;

    setPosition({ x: currentPlaybackPosition, y: SEEKER_Y_AXIS_POS });
  }, [frameWidth, currentFrame]);

  const scrollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // handle drag seeker
  const handleDrag: DraggableEventHandler = (ev, data) => {
    const currentXPos = data.x;

    const frame = Math.round(currentXPos / frameWidth);

    setPosition({ x: data.x, y: SEEKER_Y_AXIS_POS });
    setCurrentFrame(frame);

    const seeker = ev.target!;

    const timelineWrapper = document.getElementById('timeline-tracks-wrapper');
    if (!timelineWrapper) return;
  };

  return (
    <>
      <Draggable
        position={{ x: position.x, y: SEEKER_Y_AXIS_POS }}
        onDrag={handleDrag}
        onStart={(ev, data) => {
          setIsDragging(true);

          // clear interval
          clearInterval(scrollingTimerRef.current!);
          scrollingTimerRef.current = null;
        }}
        onStop={() => {
          setIsDragging(false);
          // clear interval
          clearInterval(scrollingTimerRef.current!);
          scrollingTimerRef.current = null;
        }}
        axis='x'
        scale={1}
        grid={[frameWidth, 0]}
        bounds={{ top: 0, right: timelineTrackScrollableWidth, bottom: 0, left: 0 }}
      >
        <div className='h-[28vh] absolute top-0 '>
          <div className=' h-full cursor-move bg-transparent CC_dashedBorder w-[1.6px]'>
            <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
          </div>
        </div>
      </Draggable>
    </>
  );
};

export default TimelineSeeker;
