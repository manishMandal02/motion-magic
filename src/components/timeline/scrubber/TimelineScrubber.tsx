import { useCallback, useEffect, useState } from 'react';
import { Rnd, RndDragCallback } from 'react-rnd';

type Props = {
  frameWidth: number;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  lastFrame: number;
};

const SCRUBBER_Y_AXIS_POS = 6;

export default function TimelineScrubber({ currentFrame, frameWidth, setCurrentFrame, lastFrame }: Props) {
  const [position, setPosition] = useState({ x: -1, y: SCRUBBER_Y_AXIS_POS });

  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame || 0;

    setPosition({ x: currentPlaybackPosition, y: SCRUBBER_Y_AXIS_POS });
  }, [frameWidth, currentFrame]);

  const handleDrag: RndDragCallback = useCallback(
    (_ev, data) => {
      const frame = Math.round(data.x / frameWidth);

      // if (frame < 0 || frame > lastFrame) return;
      setPosition({ x: data.x, y: SCRUBBER_Y_AXIS_POS });
      setCurrentFrame(frame);
    },
    [frameWidth, setCurrentFrame]
  );

  return (
    <>
      <Rnd
        position={{ x: position.x, y: position.y }}
        onDrag={handleDrag}
        dragAxis='x'
        dragGrid={[frameWidth, 0]}
        enableResizing={false}
        style={{
          position: 'fixed',
          zIndex: 100,
          pointerEvents: 'auto',
        }}
        bounds={'parent'}>
        <div className='h-[27vh]   bg-transparent CC_dashedBorder w-[1.6px]'>
          <span className='w-2.5 h-2.5 rounded-full bg-white absolute -top-1.5 -left-1'></span>
        </div>
      </Rnd>
    </>
  );
}
