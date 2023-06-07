'use client';
import { useEffect, useState } from 'react';
import TimelineTracks from './tracks';
import TimestampMarkers from './timestamp-markers';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { useCurrentFrame } from 'remotion';
import TimelineScrubber from './scrubber';

const TIMELINE_TRACK_HEIGHT = 40;
export const TIMELINE_MARGIN_X = 8;

export default function Timeline() {
  //local state
  const [scale, setScale] = useState(1);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [dpi, setDPI] = useState(0);

  console.log('🚀 ~ file: Timeline.tsx:18 ~ Timeline ~ frameWidth:', frameWidth);

  const [isTimelineWidthFit, setIsTimelineWidthFit] = useState(false);

  // global state
  const fps = useEditorSore((state) => state.fps);
  const currentFrame = useEditorSore((state) => state.currentFrame);
  const setCurrentFrame = useEditorSore((state) => state.setCurrentFrame);
  const isVideoLengthFixed = useEditorSore((state) => state.isVideoLengthFixed);
  const durationInFrames = useEditorSore((state) => state.durationInFrames);

  useEffect(() => {
    if (window) {
      setDPI(window.devicePixelRatio);
    }
  }, []);

  // get timeline width
  useEffect(() => {
    const timelineContainer = document.getElementById('timeline-tracks-container');
    if (!timelineContainer) return;
    setTimelineWidth(timelineContainer.scrollWidth - TIMELINE_MARGIN_X);
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
        <div className='h-[28vh] w-[100vw] bg-sky-500  overflow-hidden relative  flex'>
          {/* timeline layers */}
          <ScrollSyncPane>
            <div
              className='flex-none flex w-[3vw] left-0 z-50  bg-pink-900 max-h-[28vh] overflow-auto CC_hideScrollBar mb-[6px]'
              // ref={layerContainerFef}
              // onScroll={handleScrollLayerContainer}
            >
              <TimelineLayer trackHeight={TIMELINE_TRACK_HEIGHT} />
            </div>
          </ScrollSyncPane>
          {/* timeline tracks areas */}
          <ScrollSyncPane>
            <div
              className={`flex-auto w-[97vw]  px-1 relative h-full Z  overflow-scroll bg-emerald-700 `}
              // ref={timelineContainerRef}
              id='timeline-tracks-container'
              // onScroll={handleScrollTimelineContainer}
            >
              {/* video timestamps markers */}
              <div
                className='bg-slate-700 flex  top-0 left-0 absolute overflow-hidden items-center z-50 h-6  justify-between '
                style={{
                  width: frameWidth * durationInFrames + TIMELINE_MARGIN_X + 'px',
                }}
              >
                {timelineWidth && frameWidth ? (
                  <TimestampMarkers
                    fps={fps}
                    frameWidth={frameWidth}
                    durationInFrames={durationInFrames}
                    timelineWidth={timelineWidth - TIMELINE_MARGIN_X}
                    scale={scale}
                    onTimestampClick={setCurrentFrame}
                  />
                ) : null}
              </div>
              {/* timeline tracks */}

              <div
                className=''
                style={{
                  width: frameWidth * durationInFrames - TIMELINE_MARGIN_X * dpi + 'px',
                }}
              >
                <TimelineTracks trackHeight={TIMELINE_TRACK_HEIGHT} timelineWidth={timelineWidth} />
              </div>
              {/* timeline scrubber */}
              <>
                <TimelineScrubber
                  frameWidth={frameWidth}
                  currentFrame={currentFrame}
                  setCurrentFrame={setCurrentFrame}
                />
              </>
            </div>
          </ScrollSyncPane>
        </div>
      </ScrollSync>
    </>
  );
}
