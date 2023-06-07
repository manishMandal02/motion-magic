import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';

type Props = {
  frameWidth: number;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
};

const TimelineScrubber = ({ currentFrame, frameWidth, setCurrentFrame }: Props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame + 4 || 0;
    setPosition({ x: currentPlaybackPosition, y: 0 });
  }, [frameWidth, currentFrame]);

  const handleDrag = (x: number) => {
    const currentFrame = x / frameWidth;

    console.log('🚀 ~ file: TimelineScrubber.tsx:21 ~ handleDrag ~ x :', x);

    console.log('🚀 ~ file: TimelineScrubber.tsx:21 ~ handleDrag ~ currentFrame:', currentFrame);

    setCurrentFrame(currentFrame);
  };

  return (
    <>
      <Rnd
        position={{ x: position.x, y: 5 }}
        onDragStop={(e, d) => {
          console.log('🚀 ~ file: TimelineScrubber.tsx:54 ~ TimelineScrubber ~ d:', d);

          setPosition({ x: d.x, y: d.y });
          handleDrag(d.x - position.x);
        }}
        dragAxis='x'
        dragGrid={[frameWidth, 0]}
        enableResizing={false}
        style={{
          position: 'fixed',
          bottom: 0,
          zIndex: 60,
          left: `${position.x}px`,
        }}
      >
        <div className='h-[26.5vh] z-[60] bg-transparent CC_dashedBorder w-[1.6px] ' style={{}}>
          <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
        </div>
      </Rnd>
    </>
  );
};

export default TimelineScrubber;
