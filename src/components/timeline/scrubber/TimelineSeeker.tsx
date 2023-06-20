import { useEffect, useState } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

type Props = {
  frameWidth: number;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  lastFrame: number;
  timelineTrackWidth: number;
  timelineScrollLeft: number;
  timelineTrackWidthVisibleArea: number;
  mouseDragScroll: { left: number; right: number };
};

const SEEKER_Y_AXIS_POS = 6;

const TimelineSeeker = ({
  currentFrame,
  frameWidth,
  setCurrentFrame,
  timelineTrackWidth,
  timelineScrollLeft,
  mouseDragScroll,
}: Props) => {
  console.log('🚀 ~ file: TimelineSeeker.tsx:27 ~ mouseDragScroll:', mouseDragScroll);

  const [position, setPosition] = useState({ x: 0, y: SEEKER_Y_AXIS_POS });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame || 0;

    setPosition({ x: currentPlaybackPosition - timelineScrollLeft, y: SEEKER_Y_AXIS_POS });
  }, [frameWidth, currentFrame, timelineScrollLeft]);

  // handle drag seeker
  const handleDrag: DraggableEventHandler = (_ev, data) => {
    const currentXPos = data.x + timelineScrollLeft;

    const frame = Math.round(currentXPos / frameWidth);

    setPosition({ x: data.x, y: SEEKER_Y_AXIS_POS });
    setCurrentFrame(frame);
  };

  return (
    <>
      <Draggable
        position={{ x: position.x, y: SEEKER_Y_AXIS_POS }}
        onDrag={handleDrag}
        onStart={() => setIsDragging(true)}
        onStop={() => setIsDragging(false)}
        axis='x'
        scale={1}
        grid={[frameWidth, 0]}
        bounds={{ top: 0, right: timelineTrackWidth - timelineScrollLeft, bottom: 0, left: 0 }}
      >
        <div className='h-[28vh] absolute top-0 cursor-move bg-transparent CC_dashedBorder w-[1.6px]'>
          <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
        </div>
      </Draggable>
    </>
  );
};

export default TimelineSeeker;
