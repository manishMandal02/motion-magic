import { useEffect, useState } from 'react';
import TimelineTracks from './tracks';
import TimestampMarkers from './timestamp-markers';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { useCurrentFrame } from 'remotion';

const TIMELINE_TRACK_HEIGHT = 40;

export default function Timeline() {
  //local state
  const [scale, setScale] = useState(1);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [isTimelineWidthFit, setIsTimelineWidthFit] = useState(false);

  // global state
  const currentFrame = useEditorSore((state) => state.currentFrame);
  const setCurrentFrame = useEditorSore((state) => state.setCurrentFrame);
  const isVideoLengthFixed = useEditorSore((state) => state.isVideoLengthFixed);
  const durationInFrames = useEditorSore((state) => state.durationInFrames);

  // get timeline width
  useEffect(() => {
    const timelineContainer = document.getElementById('timeline-tracks-container');
    if (!timelineContainer) return;
    setTimelineWidth(timelineContainer.scrollWidth);
    console.log(
      '🚀 ~ file: Timeline.tsx:35 ~ useEffect ~ timelineContainer.scrollWidth:',
      timelineContainer.scrollWidth
    );
  }, []);

  useEffect(() => {
    if (timelineWidth) {
      setFrameWidth((timelineWidth / durationInFrames) * scale);
    }
  }, [scale, timelineWidth]);

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
      <ScrollSync>
        {/* parent container */}
        <div className='h-[28vh] w-[100vw]  overflow-hidden relative  flex'>
          {/* timeline layers */}
          <ScrollSyncPane>
            <div
              className='flex-none flex w-[5vw] left-0 z-50 bg-slate-900 max-h-[28vh] overflow-auto CC_hideScrollBar mb-[8px]'
              // ref={layerContainerFef}
              // onScroll={handleScrollLayerContainer}
            >
              <TimelineLayer trackHeight={TIMELINE_TRACK_HEIGHT} />
            </div>
          </ScrollSyncPane>
          {/* timeline tracks areas */}
          <ScrollSyncPane>
            <div
              className={`flex-auto w-[95vw] relative h-full border-2 border-red-500   overflow-scroll  bg-emerald-700 rounded-sm`}
              // ref={timelineContainerRef}
              id='timeline-tracks-container'
              // onScroll={handleScrollTimelineContainer}
            >
              {/* video timestamps markers */}
              <div
                className='bg-slate-700 flex  top-0 left-0 absolute overflow-hidden items-center z-50 h-6  justify-between '
                style={{
                  width: frameWidth * durationInFrames + 'px',
                }}
              >
                {timelineWidth && frameWidth ? (
                  <TimestampMarkers
                    frameWidth={frameWidth}
                    durationInFrames={durationInFrames}
                    timelineWidth={timelineWidth}
                    scale={scale}
                    onTimestampClick={setCurrentFrame}
                  />
                ) : null}
              </div>
              {/* timeline tracks */}

              <div
                className=''
                style={{
                  width: frameWidth * durationInFrames + 'px',
                }}
              >
                <TimelineTracks trackHeight={TIMELINE_TRACK_HEIGHT} timelineWidth={timelineWidth} />
              </div>
            </div>
          </ScrollSyncPane>
        </div>
      </ScrollSync>
    </>
  );
}
