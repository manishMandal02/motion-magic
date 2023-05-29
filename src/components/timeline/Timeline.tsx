import { useContainerSize } from '@/hooks/common/useContainerSize';
import { useEditorSore } from '@/store';
import { useEffect, useRef } from 'react';
import TimelineElementWrapper from '../common/element-wrapper/timeline-element';

export default function Timeline() {
  const allElements = useEditorSore((state) => state.elements);
  const totalFrameDuration = useEditorSore((state) => state.durationInFrames);
  const currentFrame = useEditorSore((state) => state.currentFrame);

  const timelineViewRef = useRef<HTMLDivElement>(null);

  const currentPlaybackPosition = (currentFrame / totalFrameDuration) * 100; // in percentage

  const { width: timelineWidth } = useContainerSize({ containerRef: timelineViewRef });

  const totalFrameWidth = timelineWidth / totalFrameDuration;

  const renderElements = () => {
    return allElements.map((element) => {
      const elementWidth = (element.endFrame - element.startFrame) * totalFrameWidth;
      const elementLeft = element.startFrame * totalFrameWidth;

      return (
        <TimelineElementWrapper
          startFrame={element.startFrame}
          endFrame={element.endFrame}
          id={element.id}
          totalFrameWidth={totalFrameWidth}
          key={element.id}
        >
          <div
            key={element.id}
            style={{
              left: elementLeft,
              width: elementWidth,
            }}
            className={`h-8 rounded-sm cursor-grab flex text-xs font-medium items-center mb-2 justify-center w-72 
          ${element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
          `}
          >
            {element.type}
          </div>
        </TimelineElementWrapper>
      );
    });
  };

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-16 flex items-center justify-center'>
        Video Controls & Timeline options
      </div>
      <div className='relative h-full max-h-full p-2 bg-slate-700' ref={timelineViewRef}>
        {/* video timestamps markers */}
        <div className='bg-slate-700 flex items-center h-1/6 w-full justify-between px-'>
          {[...new Array(21)].map((value, idx) => (
            <p key={idx} className='text-white'>
              {idx}
            </p>
          ))}
        </div>
        {/* timeline tracks */}
        <div className='h-5/6 bg-slate-900 w-full p-2'>
          <>{renderElements()}</>
        </div>
        {/* timeline scrubber */}
        <div
          className='w-px h-full top-0 ml-2 bg-white absolute rounded-lg'
          style={{ left: `${currentPlaybackPosition}%` }}
        ></div>
      </div>
    </>
  );
}
