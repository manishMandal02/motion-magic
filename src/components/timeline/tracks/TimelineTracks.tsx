import { memo } from 'react';

import { useEditorSore } from '@/store';

import { IElementFrameDuration } from '@/types/elements.type';

import { TimelineTrack } from '@/types/timeline.type';
import TracksWrapper from './tracks-wrapper';

type Props = {
  trackHeight: number;
  frameWidth: number;
  timelineWidth: number;
};

const TimelineTracks = ({ frameWidth, trackHeight, timelineWidth }: Props) => {
  // global state
  const allTracks = useEditorSore(state => state.timelineTracks, );

  console.log('🚀 ~ file: TimelineTracks.tsx:20 ~ TimelineTracks ~ allTracks:', allTracks);

  const updateTrackElFrame = useEditorSore(state => state.updateTrackElFrame);
  const updateAllTimelineTracks = useEditorSore(state => state.updateAllTimelineTracks);

  const updateElFrameDuration = (id: string, duration: IElementFrameDuration) => {
    updateTrackElFrame(id, duration.startFrame, duration.endFrame);
  };

  const updateAllTracksWithOnDragEnd = (tracks: TimelineTrack[]) => {
    console.log('🚀 ~ file: TimelineTracks.tsx:28 ~ updateAllTracksWithOnDragEnd ~ tracks:', tracks);

    updateAllTimelineTracks(tracks);
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
          updateAllTracksWithOnDragEnd={updateAllTracksWithOnDragEnd}
        />
      </div>
    </>
  );
};

export default memo(TimelineTracks);
