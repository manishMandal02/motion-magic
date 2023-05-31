import { useContainerSize } from '@/hooks/common/useContainerSize';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { useRef } from 'react';
import TimelineTracks from './tracks';
import TimestampMarkers from './timestamp-markers';
import TimelineLayer from './layer';

const TIMELINE_TRACK_HEIGHT = 40;

export default function Timeline() {
  const timelineViewRef = useRef<HTMLDivElement>(null);

  const { width: timelineWidth } = useContainerSize({ containerRef: timelineViewRef });

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-[4vh] flex items-center text-sm justify-center'>
        Video Controls & Timeline options
      </div>
      <div className='h-[28vh] w-full overflow-y-scroll overflow-x-hidden flex'>
        {/* timeline layers */}
        <div className='flex-none w-20 '>
          <TimelineLayer trackHeight={TIMELINE_TRACK_HEIGHT} />
        </div>
        <div className='flex-auto relative rounded-sm' ref={timelineViewRef}>
          {/* video timestamps markers */}
          <div className='bg-slate-700 flex  top-0 sticky items-center z-50 h-6 w-full justify-between '>
            <TimestampMarkers />
          </div>
          {/* timeline tracks */}
          <div className='w-full'>
            <TimelineTracks trackHeight={TIMELINE_TRACK_HEIGHT} timelineWidth={timelineWidth} />
          </div>
        </div>
      </div>
    </>
  );
}
