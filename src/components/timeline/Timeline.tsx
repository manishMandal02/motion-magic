import { useContainerSize } from '@/hooks/common/useContainerSize';
import { useRef } from 'react';
import TimelineTracks from './tracks';
import TimestampMarkers from './timestamp-markers';

export default function Timeline() {
  const timelineViewRef = useRef<HTMLDivElement>(null);

  const { width: timelineWidth } = useContainerSize({ containerRef: timelineViewRef });

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-16 flex items-center justify-center'>
        Video Controls & Timeline options
      </div>
      <div className='relative h-full max-h-full p-2 bg-slate-700' ref={timelineViewRef}>
        {/* video timestamps markers */}
        <div className='bg-slate-700 flex items-center h-1/6 w-full justify-between px-'>
          <TimestampMarkers />
        </div>
        {/* timeline tracks */}
        <div className='h-5/6 bg-slate-900 w-full pl-1  '>
          <TimelineTracks timelineWidth={timelineWidth} />
        </div>
      </div>
    </>
  );
}
