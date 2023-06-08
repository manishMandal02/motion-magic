import { useCallback, useEffect, useState } from 'react';
import { Rnd, RndDragCallback } from 'react-rnd';

type Props = {
  frameWidth: number;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  timelineMargins: number;
};

export default function TimelineScrubber({ currentFrame, frameWidth, setCurrentFrame }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame || 0;
    setPosition({ x: currentPlaybackPosition, y: 0 });
  }, [frameWidth, currentFrame]);

  const handleDrag: RndDragCallback = useCallback(
    (_ev, data) => {
      const frame = Math.round(data.x / frameWidth);

      setPosition({ x: data.x, y: 0 });
      setCurrentFrame(frame);
    },
    [frameWidth, setCurrentFrame]
  );

  return (
    <>
      <Rnd
        position={{ x: position.x, y: 6 }}
        onDrag={handleDrag}
        dragAxis='x'
        dragGrid={[frameWidth, 0]}
        enableResizing={false}
        style={{
          position: 'fixed',
          bottom: 0,
          zIndex: 80,
        }}>
        <div className='h-[26.5vh] z-[60] bg-transparent CC_dashedBorder w-[1.6px] ' style={{}}>
          <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
        </div>
      </Rnd>
    </>
  );
}
