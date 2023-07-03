import { memo, useCallback, useEffect, useRef, useState } from 'react';
import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';

import { useEditorSore } from '@/store';

import { IElementFrameDuration } from '@/types/elements.type';

import TracksWrapper from './tracks-wrapper';

type Props = {
  trackHeight: number;
  frameWidth: number;
  timelineWidth: number;
};

const TimelineTracks = ({ frameWidth, trackHeight, timelineWidth }: Props) => {
  // global state
  const allTracks = useEditorSore(state => state.timelineTracks);
  const updateTrackElFrame = useEditorSore(state => state.updateTrackElFrame);

  const updateElFrameDuration = (id: string, duration: IElementFrameDuration, newLayer?: number) => {
    if (typeof newLayer !== 'undefined') {
      updateTrackElFrame(id, duration.startFrame, duration.endFrame, newLayer);
    } else {
      updateTrackElFrame(id, duration.startFrame, duration.endFrame);
    }
  };

  return (
    <>
      <div
        className='relative min-w-full h-full bg-brand-darkPrimary tracksContainer'
        style={{
          height: trackHeight * allTracks.length,
          width: timelineWidth + 6 + 'px',
        }}
        id='tracksContainer'
      >
        <TracksWrapper
          tracks={allTracks}
          frameWidth={frameWidth}
          trackHeight={trackHeight}
          trackWidth={timelineWidth}
          updateElFrameDuration={updateElFrameDuration}
        />
      </div>
    </>
  );
};

export default memo(TimelineTracks);
