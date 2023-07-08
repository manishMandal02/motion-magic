import { useEditorStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

type Props = {
  frameWidth: number;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  timelineTrackScrollableWidth: number;
  scrollYPos: number;
};

const SEEKER_Y_AXIS_POS = 6;

const TimelineSeeker = ({
  currentFrame,
  frameWidth,
  setCurrentFrame,
  timelineTrackScrollableWidth,
  scrollYPos,
}: Props) => {
  // local state
  const [position, setPosition] = useState({ x: 0, y: SEEKER_Y_AXIS_POS });
  const [scroll, setScroll] = useState(0);

  useEffect(() => {}, []);

  useEffect(() => {
    const tracksContainer = document.getElementById('tracksContainer');
    if (!tracksContainer) return;
    setScroll(prev =>
      scrollYPos + SEEKER_Y_AXIS_POS < tracksContainer.clientHeight - 190 ? scrollYPos : prev
    );
  }, [scrollYPos]);

  //TODO: get tracks container height dynamically

  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame || 0;

    setPosition({ x: currentPlaybackPosition, y: scroll + SEEKER_Y_AXIS_POS });
  }, [frameWidth, currentFrame, scroll]);

  // handle drag seeker
  const handleDrag: DraggableEventHandler = (_ev, data) => {
    const currentXPos = data.x;

    const frame = Math.round(currentXPos / frameWidth);

    setPosition({ x: data.x, y: scroll + SEEKER_Y_AXIS_POS });
    setCurrentFrame(frame);
  };

  useEffect(() => {
    setPosition(prev => ({
      ...prev,
      y: scroll + SEEKER_Y_AXIS_POS,
    }));
  }, [scroll]);

  return (
    <>
      <Draggable
        position={{ x: position.x, y: position.y }}
        onDrag={handleDrag}
        axis='x'
        scale={1}
        grid={[frameWidth, 0]}
        bounds={{ top: 0, right: timelineTrackScrollableWidth, bottom: 0, left: 0 }}
      >
        <div
          className='h-[calc(28vh-15px)] absolute top-0 z-50 '
          id='timeline-seeker'
          data-current-frame={currentFrame}
        >
          <div className=' h-full cursor-move bg-transparent CC_dashedBorder_Seeker w-[1.6px]'>
            <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
          </div>
        </div>
      </Draggable>
    </>
  );
};

export default TimelineSeeker;
