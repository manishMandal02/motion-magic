'use client';

import { useEffect, useState } from 'react';
import TimelineTracks from './tracks';
import TimestampMarkers from './timestamp-markers';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import TimelineScrubber from './scrubber';
import VideoControls from './video-controls';

const TIMELINE_TRACK_HEIGHT = 40;
export const TIMELINE_MARGIN_X = 4;

export default function Timeline() {
  //local state
  const [scale, setScale] = useState(1);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);

  console.log('🚀 ~ file: Timeline.tsx:18 ~ Timeline ~ frameWidth:', frameWidth);

  const [isTimelineWidthFit, setIsTimelineWidthFit] = useState(false);

  // global state
  const fps = useEditorSore(state => state.fps);
  const currentFrame = useEditorSore(state => state.currentFrame);
  const setCurrentFrame = useEditorSore(state => state.setCurrentFrame);
  const isVideoLengthFixed = useEditorSore(state => state.isVideoLengthFixed);
  const durationInFrames = useEditorSore(state => state.durationInFrames);

  // get timeline width
  useEffect(() => {
    const timelineContainer = document.getElementById('timeline-tracks-container');
    if (!timelineContainer) return;
    setTimelineWidth(timelineContainer.scrollWidth);
  }, []);

  useEffect(() => {
    if (timelineWidth) {
      setFrameWidth((timelineWidth / durationInFrames) * scale);
    }
  }, [scale, timelineWidth, durationInFrames]);

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-[4vh] flex items-center text-sm justify-center'>
        <>
          <VideoControls
            fps={fps}
            currentFrame={currentFrame}
            durationInFrames={durationInFrames}
            setCurrentFrame={setCurrentFrame}
          />
        </>
      </div>
      <ScrollSync>
        {/* parent container */}
        <div className='h-[28vh] w-[100vw] bg-sky-500  overflow-hidden relative  flex'>
          {/* timeline layers */}
          <ScrollSyncPane>
            <div className='flex-none flex w-[3vw] left-0 z-40 bg-brand-darkPrimary  max-h-[28vh] overflow-auto CC_hideScrollBar mb-[6px]'>
              <TimelineLayer trackHeight={TIMELINE_TRACK_HEIGHT} />
            </div>
          </ScrollSyncPane>
          {/* timeline tracks areas */}
          <ScrollSyncPane>
            <div
              className={`flex-auto w-[97vw] z-50 relative h-full pr-[${frameWidth}px]   overflow-scroll bg-emerald-700 `}
              // ref={timelineContainerRef}
              id='timeline-tracks-container'
              // onScroll={handleScrollTimelineContainer}
            >
              {/* video timestamps markers */}
              <div
                className='bg-brand-darkSecondary flex  top-0 left-0 sticky overflow-hidden overflow-x-visible items-center z-50 h-6  justify-between '
                // frame counting starts from 0 so an extra frame
                style={{
                  width: frameWidth * durationInFrames * scale + frameWidth + 'px',
                }}>
                {timelineWidth && frameWidth ? (
                  <TimestampMarkers
                    fps={fps}
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
                }}>
                <TimelineTracks trackHeight={TIMELINE_TRACK_HEIGHT} frameWidth={frameWidth} />
              </div>
              {/* timeline scrubber */}
              <>
                <TimelineScrubber
                  frameWidth={frameWidth}
                  currentFrame={currentFrame}
                  setCurrentFrame={setCurrentFrame}
                  lastFrame={durationInFrames}
                />
              </>
            </div>
          </ScrollSyncPane>
        </div>
      </ScrollSync>
    </>
  );
}
