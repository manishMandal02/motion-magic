import { useContainerSize } from '@/hooks/common/useContainerSize';
import { UIEvent, useEffect, useRef, useState } from 'react';
import TimelineTracks from './tracks';
import TimestampMarkers from './timestamp-markers';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';

const TIMELINE_TRACK_HEIGHT = 40;

export default function Timeline() {
  const allTracks = useEditorSore((state) => state.timelineTracks);
  const durationInFrames = useEditorSore((state) => state.durationInFrames);
  const [scale, setScale] = useState<number>(2);
  const [framePerWidth, setFramePerWidth] = useState<number>(0);
  const [isTimelineWidthFit, setIsTimelineWidthFit] = useState(false);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  const { width: timelineWidth } = useContainerSize({
    containerRef: timelineContainerRef,
    getScrollableSize: true,
  });

  useEffect(() => {
    if (timelineWidth) {
      setFramePerWidth((timelineWidth / durationInFrames) * scale);
    }
  }, [scale, timelineWidth]);

  // scroll layer & timeline container simultaneously
  const layerContainerFef = useRef<HTMLDivElement>(null);

  const handleScrollLayerContainer = (scroll: UIEvent<HTMLDivElement>) => {
    if (!timelineContainerRef.current) return;
    timelineContainerRef.current.scrollTop = scroll.currentTarget.scrollTop;
  };

  const handleScrollTimelineContainer = (scroll: UIEvent<HTMLDivElement>) => {
    if (!layerContainerFef.current) return;
    layerContainerFef.current.scrollTop = scroll.currentTarget.scrollTop;
  };

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-[4vh] flex items-center text-sm justify-center'>
        Video Controls & Timeline options
        <button
          className={`border border-slate-600 ml-4 px-1.5 text-slate-400 rounded-sm `}
          onClick={() => {
            setIsTimelineWidthFit(!isTimelineWidthFit);
          }}
        >
          Fit
        </button>
      </div>
      {/* parent container */}
      <div className='h-[28vh] w-[100vw]  overflow-hidden  flex'>
        {/* timeline layers */}
        <div
          className='flex-none flex w-[5vw] sticky left-0 z-50  bg-slate-900 max-h-[28vh] overflow-y-auto CC_hideScrollBar mb-[6px]'
          ref={layerContainerFef}
          onScroll={handleScrollLayerContainer}
        >
          <TimelineLayer trackHeight={TIMELINE_TRACK_HEIGHT} />
        </div>
        {/* timeline tracks areas */}
        <div
          className={`flex-auto w-[95vw]  border-2 border-red-500   overflow-y-scroll  overflow-x-scroll  bg-emerald-700 rounded-sm`}
          ref={timelineContainerRef}
          onScroll={handleScrollTimelineContainer}
        >
          {/* video timestamps markers */}
          <div
            className='bg-slate-700 flex  top-0 sticky  items-center z-50 h-6 w-full justify-between '
            style={{
              width: framePerWidth * durationInFrames + 'px',
            }}
          >
            <TimestampMarkers />
          </div>
          {/* timeline tracks */}

          <div
            className=''
            style={{
              width: framePerWidth * durationInFrames + 'px',
            }}
          >
            <TimelineTracks trackHeight={TIMELINE_TRACK_HEIGHT} timelineWidth={timelineWidth} />
          </div>
        </div>
      </div>
    </>
  );
}
