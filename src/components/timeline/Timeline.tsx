import { useContainerSize } from '@/hooks/common/useContainerSize';
import { useEditorSore } from '@/store';
import { useEffect, useRef } from 'react';

export default function Timeline() {
  const allElements = useEditorSore((state) => state.elements);
  const totalDuration = useEditorSore((state) => state.durationInFrames);
  const currentFrame = useEditorSore((state) => state.currentFrame);

  const timelineViewRef = useRef<HTMLDivElement>(null);

  const currentPlaybackPosition = (currentFrame / totalDuration) * 100; // in percentage

  const { width: timelineWidth } = useContainerSize({ containerRef: timelineViewRef });

  const frameWidth = timelineWidth / totalDuration;

  const onScrubberDrag = () => {};

  const renderElements = () => {
    return allElements.map((element) => {
      const elementWidth = (element.endFrame - element.startFrame) * frameWidth;
      const elementLeft = element.startFrame * frameWidth;

      return (
        <div
          key={element.id}
          style={{
            left: elementLeft,
            width: elementWidth,
          }}
          className={`h-8 absolute rounded-sm cursor-grab flex text-xs font-medium items-center mb-2 justify-center w-72 
          ${element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
          `}
        >
          {/* Render the element content */}
        </div>
      );
    });
  };

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-16 flex items-center justify-center'>
        Video Controls & Timeline options
      </div>
      <div className='relative h-full' ref={timelineViewRef}>
        {/* video timestamps markers */}
        <div className='bg-slate-600 h-8 flex items-center w-full justify-between px-1.5'>
          {[...new Array(11)].map((value, idx) => (
            <p key={idx} className='text-white'>
              {idx}
            </p>
          ))}
        </div>
        {/* {allElements.map((element, i) => (
          <div
            className={`h-8 rounded-sm cursor-grab flex text-xs font-medium items-center mb-2 justify-center w-72 
            ${element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
            `}
            key={element.id}
          >
            {element.type}
          </div>
        ))} */}
        <>{renderElements()}</>
        {/* Timeline scrubber */}
        <div
          className='w-px h-9/10 top-0 left-0 bg-white absolute rounded-lg'
          style={{ left: `${currentPlaybackPosition}%` }}
        ></div>
      </div>
    </>
  );
}
