import { memo } from 'react';

import { useEditorStore } from '@/store';

import { IElementFrameDuration } from '@/types/elements.type';

import { TimelineTrack } from '@/types/timeline.type';
import TracksWrapper from './tracks-wrapper';

type Props = {
  trackHeight: number;
  frameWidth: number;
  timelineWidth: number;
  timelineVisibleWidth: number;
};

const TimelineTracks = ({ frameWidth, trackHeight, timelineWidth, timelineVisibleWidth }: Props) => {
  // global state
  const allTracks = useEditorStore(state => state.timelineTracks);

  console.log('🚀 ~ file: TimelineTracks.tsx:20 ~ TimelineTracks ~ allTracks:', allTracks);

  const updateTrackElFrame = useEditorStore(state => state.updateTrackElFrame);

  const updateElFrameDuration = (id: string, duration: IElementFrameDuration) => {
    updateTrackElFrame(id, duration.startFrame, duration.endFrame);
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
          tracks={[...allTracks]}
          frameWidth={frameWidth}
          trackHeight={trackHeight}
          trackWidth={timelineWidth}
          updateElFrameDuration={updateElFrameDuration}
          timelineVisibleWidth={timelineVisibleWidth}
        />
      </div>
    </>
  );
};

export default memo(TimelineTracks);
