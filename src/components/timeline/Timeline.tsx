'use client';

import { useEffect, useMemo, useState } from 'react';
import TimelineTracks from './tracks';
import TimelineRuler from './timeline-ruler';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import TimelineScrubber from './scrubber';
import VideoControls from './video-controls';
import getFrameWidthSize from '@/utils/timeline/getFrameWidthSize';
import getInitialTimelineScale from '@/utils/timeline/getInitialTimelineScale';

const TIMELINE_TRACK_HEIGHT = 40;
export const TIMELINE_PADDING_X = 12;

export default function Timeline() {
  //local state
  const [scale, setScale] = useState(1);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [isScaleFitToTimeline, setIsScaleFitToTimeline] = useState(false);
  const [timelineWrapperEl, setTimelineWrapperEl] = useState<HTMLElement | null>(null);

  // global state
  const fps = useEditorSore(state => state.fps);
  const currentFrame = useEditorSore(state => state.currentFrame);
  const setCurrentFrame = useEditorSore(state => state.setCurrentFrame);
  // const isVideoLengthFixed = useEditorSore(state => state.isVideoLengthFixed);
  const durationInFrames = useEditorSore(state => state.durationInFrames);

  //TODO: render extra time duration (empty space) on the timeline to allow elements to be able to dragged and increase total duration --
  //TODO: -- we can set default extra duration value (like 2.5 min) and also calculate 2x or 1.5x based on the total duration

  // get timeline width
  useEffect(() => {
    const timelineWrapper = document.getElementById('timeline-tracks-wrapper');
    if (!timelineWrapper) return;
    setTimelineWrapperEl(timelineWrapper);
    setTimelineWidth(timelineWrapper.scrollWidth - 5);
  }, []);

  useEffect(() => {
    const initialTimelineScale = getInitialTimelineScale(durationInFrames);

    setIsScaleFitToTimeline(true);
    setScale(initialTimelineScale);
  }, [durationInFrames]);

  // get frameWidth
  useEffect(() => {
    if (timelineWidth) {
      const frameWidthSize = getFrameWidthSize({
        scale,
        durationInFrames,
        timelineWidth,
        isScaleFitToTimeline,
        isStartingFromZero: true,
      });
      setFrameWidth(frameWidthSize);
    }
  }, [scale, timelineWidth, durationInFrames, isScaleFitToTimeline]);

  // timeline width based on total frame (starting from zero for ruler)
  const totalFrameWidthPlus1 = useMemo(
    () => frameWidth * (durationInFrames + 1),
    [frameWidth, durationInFrames]
  );

  const totalFrameWidth = useMemo(
    () => (timelineWidth / durationInFrames) * durationInFrames,
    [durationInFrames, timelineWidth]
  );

  const frameWidthStartingFromOne = useMemo(
    () => getFrameWidthSize({ durationInFrames, isScaleFitToTimeline, scale, timelineWidth }),
    [durationInFrames, isScaleFitToTimeline, scale, timelineWidth]
  );

  console.log(
    '🚀 ~ file: Timeline.tsx:80 ~ Timeline ~ frameWidthStartingFromOne:',
    frameWidthStartingFromOne
  );

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    setIsScaleFitToTimeline(false);
  };

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-[4vh] flex items-center text-sm justify-center'> 
        <>
          <VideoControls
            fps={fps}
            scale={scale}
            setIsScaleFitToTimeline={setIsScaleFitToTimeline}
            updateScale={handleScaleChange}
            currentFrame={currentFrame}
            durationInFrames={durationInFrames}
            setCurrentFrame={setCurrentFrame}
          />
        </>
      </div>
      <ScrollSync>
        {/* parent container */}
        <div className='h-[28vh] w-[100vw] bg-pink-600  overflow-hidden relative  flex'>
          {/* timeline layers */}
          <ScrollSyncPane>
            <div className='flex-none flex w-[3vw] left-0 z-40 bg-brand-darkPrimary  max-h-[28vh] overflow-auto CC_hideScrollBar mb-[6px]'>
              <TimelineLayer trackHeight={TIMELINE_TRACK_HEIGHT} />
            </div>
          </ScrollSyncPane>
          {/* timeline wrapper - for padding and scroll */}
          <div
            className={`flex-auto w-[97vw] relative h-full pl-1.5  items-center justify-center flex CC_hideScrollBar  overflow-hidden bg-emerald-700 `}
          >
            {/* timeline tracks & timestamp wrapper */}
            <ScrollSyncPane>
              <div
                className={`bg-indigo-500 h-[28vh] overflow-scroll   min-w-full`}
                id='timeline-tracks-wrapper'
              >
                {/* timeline ruler */}
                <div
                  className={`bg-brand-darkSecondary top-0 left-0 sticky  z-50 h-6 `}
                  style={{
                    width: totalFrameWidthPlus1 + 'px',
                  }}
                >
                  {totalFrameWidthPlus1 && frameWidth ? (
                    <TimelineRuler
                      scale={scale}
                      frameWidth={frameWidth}
                      durationInFrames={durationInFrames}
                      onTimestampClick={setCurrentFrame}
                      isScaleFitToTimeline={isScaleFitToTimeline}
                    />
                  ) : null}
                </div>

                {/* timeline tracks */}
                <div
                  className='h-full'
                  style={{
                    width: totalFrameWidth + 'px',
                  }}
                >
                  <TimelineTracks
                    trackHeight={TIMELINE_TRACK_HEIGHT}
                    frameWidth={frameWidthStartingFromOne}
                  />
                </div>
                {/* timeline scrubber */}
                <div
                  className='h-[27vh] fixed  bottom-[.46rem] z-[200] bg-transparent pointer-events-none'
                  style={{
                    width: totalFrameWidth + 'px',
                  }}
                >
                  {timelineWrapperEl ? (
                    <TimelineScrubber
                      frameWidth={frameWidth}
                      currentFrame={currentFrame}
                      setCurrentFrame={setCurrentFrame}
                      lastFrame={durationInFrames}
                    />
                  ) : null}
                </div>
              </div>
            </ScrollSyncPane>
          </div>
        </div>
      </ScrollSync>
    </>
  );
}
