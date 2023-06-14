'use client';

import { useEffect, useMemo, useState } from 'react';
import TimelineTracks from './tracks';
import TimelineRuler from './timeline-ruler';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import TimelineScrubber from './scrubber';
import VideoControls from './video-controls';

const TIMELINE_TRACK_HEIGHT = 40;
export const TIMELINE_PADDING_X = 12;

export default function Timeline() {
  //local state
  const [scale, setScale] = useState(1);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [timelineWrapperEl, setTimelineWrapperEl] = useState<HTMLElement | null>(null);

  // console.log('🚀 ~ file: Timeline.tsx:18 ~ Timeline ~ frameWidth:', frameWidth);

  // global state
  const fps = useEditorSore(state => state.fps);
  const currentFrame = useEditorSore(state => state.currentFrame);
  const setCurrentFrame = useEditorSore(state => state.setCurrentFrame);
  const isVideoLengthFixed = useEditorSore(state => state.isVideoLengthFixed);
  const durationInFrames = useEditorSore(state => state.durationInFrames);

  // get timeline width
  useEffect(() => {
    const timelineWrapper = document.getElementById('timeline-tracks-wrapper');
    if (!timelineWrapper) return;
    setTimelineWrapperEl(timelineWrapper);
    setTimelineWidth(timelineWrapper.scrollWidth - 5);
  }, []);

  useEffect(() => {
    if (timelineWidth) {
      setFrameWidth((timelineWidth / (durationInFrames + 1)) * scale);
    }
  }, [scale, timelineWidth, durationInFrames]);

  // TODO:
  const maxFrameWidth = useMemo(() => (timelineWidth / 100) * 3, [timelineWidth]);
  const minFrameWidth = 0.15;

  // timeline width based on total frame, 1 frame width & scale
  const totalFrameWidthPlus1 = useMemo(
    () => frameWidth * (durationInFrames + 1),
    [frameWidth, durationInFrames]
  );

  // console.log('🚀 ~ file: Timeline.tsx:51 ~ Timeline ~ durationInFrames:', durationInFrames);

  // console.log('🚀 ~ file: Timeline.tsx:51 ~ Timeline ~ frameWidth:', frameWidth);

  // console.log('🚀 ~ file: Timeline.tsx:51 ~ Timeline ~ totalFrameWidthPlus1:', totalFrameWidthPlus1);

  const totalFrameWidth = useMemo(
    () => (timelineWidth / durationInFrames) * durationInFrames * scale,
    [scale, durationInFrames, timelineWidth]
  );

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-[4vh] flex items-center text-sm justify-center'>
        <>
          <VideoControls
            fps={fps}
            scale={scale}
            setScale={setScale}
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
                      fps={fps}
                      scale={scale}
                      frameWidth={frameWidth}
                      durationInFrames={durationInFrames}
                      timelineWidth={totalFrameWidthPlus1}
                      onTimestampClick={setCurrentFrame}
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
                    frameWidth={(timelineWidth / durationInFrames) * scale}
                    durationInFrames={durationInFrames}
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
