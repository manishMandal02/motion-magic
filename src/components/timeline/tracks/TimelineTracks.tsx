import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef } from 'react';
import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';

import { useEditorSore } from '@/store';

import { IElementFrameDuration } from '@/types/elements.type';

type Props = {
  timelineWidth: number;
  trackHeight: number;
};

const TimelineTracks = ({ timelineWidth, trackHeight }: Props) => {
  const allTracks = useEditorSore((state) => state.timelineTracks);

  const updateTimelineTrack = useEditorSore((state) => state.updateTimelineTrack);
  const currentFrame = useEditorSore((state) => state.currentFrame);

  const totalFrameDuration = useEditorSore((state) => state.durationInFrames);

  // autoAnimate
  const autoAnimateDiv = useRef(null);

  useEffect(() => {
    autoAnimateDiv.current && autoAnimate(autoAnimateDiv.current);
  }, [autoAnimateDiv]);

  const currentPlaybackPosition = (currentFrame / totalFrameDuration) * 100; // in percentage

  const singleFrameWidth = timelineWidth / totalFrameDuration;

  const updateElFrameDuration = (id: string, duration: IElementFrameDuration) => {
    updateTimelineTrack(id, {
      element: {
        startFrame: duration.startFrame,
        endFrame: duration.endFrame,
      },
    });
  };

  console.log('TimelineTracks component rerendered');

  // renders all el on timeline tracks based on their layer levels
  const renderElements = () => {
    return allTracks.map((track) => {
      const { startFrame, endFrame } = track.element;
      // width of el based on their start & end time
      const width = (endFrame - startFrame) * singleFrameWidth;
      // position of el from left to position them based on their start time
      const translateX = startFrame * singleFrameWidth;
      // to set them on their respective tracks, so all el don't end up on same track
      // const positionY = TIMELINE_TRACK_HEIGHT * element.layer;
      return (
        <div
          key={track.layer}
          className={` shadow-sm shadow-slate-700  relative `}
          style={{ height: trackHeight }}
        >
          <TimelineElementWrapper
            startFrame={startFrame}
            endFrame={endFrame}
            id={track.element.id}
            singleFrameWidth={singleFrameWidth}
            updateElFrameDuration={updateElFrameDuration}
            width={width}
            translateX={translateX}
            height={trackHeight - 10}
          >
            <div
              key={track.layer}
              className={`rounded-md h-full w-[${width}px] flex text-xs font-medium items-center mb-2 justify-center overflow-hidden
              ${track.element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
              `}
            >
              {track.element.type}
            </div>
          </TimelineElementWrapper>
        </div>
      );
    });
  };
  return (
    <>
      <div className=' relative flex flex-col flex-1  w-full bg-red-30' ref={autoAnimateDiv}>
        <div className=' relative w-full flex-1 bg-blue-40'>{renderElements()}</div>
      </div>
      {/* timeline scrubber */}
      <div
        className='w-px h-full top-0 ml-2 bg-white absolute rounded-lg '
        style={{ left: `${currentPlaybackPosition}%` }}
      ></div>
    </>
  );
};

export default TimelineTracks;
