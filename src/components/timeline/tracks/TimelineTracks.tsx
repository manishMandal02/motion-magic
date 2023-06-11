import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef } from 'react';
import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';

import { useEditorSore } from '@/store';

import { IElementFrameDuration } from '@/types/elements.type';

type Props = {
  trackHeight: number;
  frameWidth: number;
  durationInFrames: number;
};

const TimelineTracks = ({ frameWidth, trackHeight, durationInFrames }: Props) => {
  const allTracks = useEditorSore(state => state.timelineTracks);

  const updateTimelineTrack = useEditorSore(state => state.updateTimelineTrack);

  // autoAnimate
  const autoAnimateDiv = useRef(null);

  console.log('🔥🔥🔥 TimelineTracks.tsx rendered');

  useEffect(() => {
    autoAnimateDiv.current && autoAnimate(autoAnimateDiv.current);
  }, [autoAnimateDiv]);

  const updateElFrameDuration = (id: string, duration: IElementFrameDuration) => {
    updateTimelineTrack(id, {
      element: {
        startFrame: duration.startFrame,
        endFrame: duration.endFrame,
      },
    });
  };

  // renders all el on timeline tracks based on their layer levels
  const renderElements = () => {
    return allTracks.map(track => {
      const { startFrame, endFrame } = track.element;
      // width of el based on their start & end time
      const width = (endFrame - startFrame) * frameWidth;
      // position of el from left to position them based on their start time
      const translateX = startFrame * frameWidth;

      console.log('🚀 ~ file: TimelineTracks.tsx:44 ~ renderElements ~ startFrame:', startFrame);

      console.log('🚀 ~ file: TimelineTracks.tsx:45 ~ returnallTracks.map ~ translateX:', translateX);

      return (
        <div
          key={track.layer}
          className={` shadow-sm shadow-slate-700  relative `}
          style={{ height: trackHeight }}>
          <TimelineElementWrapper
            startFrame={startFrame}
            endFrame={endFrame}
            id={track.element.id}
            singleFrameWidth={frameWidth}
            updateElFrameDuration={updateElFrameDuration}
            width={width}
            translateX={translateX}
            height={trackHeight - 10}>
            <div
              key={track.layer}
              className={`rounded-md h-full w-[${width}px] flex text-xs font-medium items-center mb-2 justify-center overflow-hidden
              ${track.element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
              `}>
              {track.element.type}
            </div>
          </TimelineElementWrapper>
        </div>
      );
    });
  };
  return (
    <>
      <div className=' relative flex flex-col flex-1  w-full ' ref={autoAnimateDiv}>
        <div className=' relative w-full flex-1 bg-blue-400'>{renderElements()}</div>
      </div>
    </>
  );
};

export default TimelineTracks;
