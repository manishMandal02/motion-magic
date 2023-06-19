'use client';

import { useEffect, useMemo, useState } from 'react';
import TimelineTracks from './tracks';
import TimelineRuler from './timeline-ruler';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import TimelineSeeker from './scrubber';
import VideoControls from './video-controls';
import getFrameWidthSize from '@/utils/timeline/getFrameWidthSize';
import getInitialTimelineScale from '@/utils/timeline/getInitialTimelineScale';

import throttle from 'raf-throttle';
import { RndDragCallback } from 'react-rnd';

const TIMELINE_TRACK_HEIGHT = 40;
// have to manually change scroll bar width from globals.css i if changed here
export const TIMELINE_SCROLLBAR_WIDTH = 7;

export default function Timeline() {
  //local state
  const [scale, setScale] = useState(1);
  const [timelineTrackWidth, setTimelineWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [isScaleFitToTimeline, setIsScaleFitToTimeline] = useState(false);

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
    setTimelineWidth(timelineWrapper.scrollWidth);
  }, [scale]);

  useEffect(() => {
    const initialTimelineScale = getInitialTimelineScale(durationInFrames);

    setIsScaleFitToTimeline(true);
    setScale(initialTimelineScale);
  }, [durationInFrames]);

  // get frameWidth
  useEffect(() => {
    if (timelineTrackWidth) {
      const frameWidthSize = getFrameWidthSize({
        scale,
        durationInFrames,
        timelineTrackWidth,
        isScaleFitToTimeline,
        isStartingFromZero: true,
      });
      setFrameWidth(frameWidthSize);
    }
  }, [scale, timelineTrackWidth, durationInFrames, isScaleFitToTimeline]);

  // calculate total track length in frames (more than total duration)

  const EXTRA_TIME_IN_PER = 55; // percentage

  const totalTrackDuration = useMemo(
    () => durationInFrames + ((timelineTrackWidth / frameWidth) * EXTRA_TIME_IN_PER) / 100,
    [durationInFrames, frameWidth, timelineTrackWidth]
  );

  console.log('🚀 ~ file: Timeline.tsx:78 ~ Timeline ~ totalTrackDuration:', totalTrackDuration);

  // timeline width based on total frame (starting from zero for ruler)
  const totalFrameWidthPlus1 = useMemo(() => {
    if (isScaleFitToTimeline) {
      return frameWidth * (durationInFrames + 1);
    } else {
      return frameWidth * totalTrackDuration;
    }
  }, [frameWidth, durationInFrames, isScaleFitToTimeline, totalTrackDuration]);

  const totalFrameWidth = useMemo(() => {
    if (isScaleFitToTimeline) {
      return (timelineTrackWidth / durationInFrames) * durationInFrames;
    } else {
      return frameWidth * totalTrackDuration;
    }
  }, [durationInFrames, frameWidth, timelineTrackWidth, isScaleFitToTimeline, totalTrackDuration]);

  const frameWidthStartingFromOne = useMemo(
    () =>
      getFrameWidthSize({
        durationInFrames: totalTrackDuration,
        isScaleFitToTimeline,
        scale,
        timelineTrackWidth,
      }),
    [isScaleFitToTimeline, scale, timelineTrackWidth, totalTrackDuration]
  );

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    setIsScaleFitToTimeline(false);
  };

  // seeker states & logics ****************

  // seeker positionX
  const [positionX, setPositionX] = useState(0);
  useEffect(() => {
    const currentPlaybackPosition = frameWidth * currentFrame || 0;

    setPositionX(currentPlaybackPosition);
  }, [frameWidth, currentFrame]);

  // handle seeker drag
  const handleDragSeeker: RndDragCallback = (_ev, data) => {
    const currentXPos = data.x;

    console.log('🚀 ~ file: TimelineSeeker.tsx:103 ~ data:', data);

    const frame = Math.round(currentXPos / frameWidth);

    setPositionX(data.x);
    setCurrentFrame(frame);
  };
  //*********** */

  return (
    <>
      {/* video controls & timeline options */}
      <div className='bg-slate-500 w-full h-[4vh] flex items-center text-sm justify-center '>
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
          <div className='flex-none flex w-[3vw] flex-col relative  z-30 bg-brand-darkPrimary  max-h-[28vh]   '>
            <div className='flex sticky top-0 h-[3vh] items-center justify-center bg-brand-darkSecondary z-30 font-light text-slate-300 text-xs py-[0.25rem] pr-2'>
              Layer
            </div>
            <ScrollSyncPane>
              <div className='overflow-y-auto overflow-x-hidden max-h-[25vh]  CC_hideScrollBar'>
                <TimelineLayer trackHeight={TIMELINE_TRACK_HEIGHT} />
              </div>
            </ScrollSyncPane>
          </div>
          {/* timeline tracks & timestamp wrapper */}
          <ScrollSyncPane>
            <div
              className={` w-[97vw] relative h-[28vh]   flex flex-col  bg-emerald-700 `}
              id='timeline-tracks-wrapper'
            >
              {/* wrapper */}
              <div className='min-w-full h-full CC_customScrollBar overflow-scroll '>
                {/* timeline ruler */}
                <div
                  className={`bg-brand-darkSecondary   top-0 left-0 sticky  h-[3vh] `}
                  style={{
                    width: totalFrameWidthPlus1 + 'px',
                  }}
                >
                  <TimelineRuler
                    scale={scale}
                    frameWidth={frameWidth}
                    durationInFrames={totalTrackDuration}
                    onTimestampClick={setCurrentFrame}
                    isScaleFitToTimeline={isScaleFitToTimeline}
                  />
                </div>
                {/* timeline tracks */}

                <div
                  className='h-[25vh] relative'
                  style={{
                    width: totalFrameWidth + 'px',
                  }}
                >
                  <TimelineTracks
                    trackHeight={TIMELINE_TRACK_HEIGHT}
                    frameWidth={frameWidthStartingFromOne}
                  />
                </div>
                <TimelineSeeker
                  durationInFrames={durationInFrames}
                  frameWidth={frameWidth}
                  handleDrag={handleDragSeeker}
                  positionX={positionX}
                  positionY={-6}
                />
              </div>
            </div>
          </ScrollSyncPane>
        </div>
      </ScrollSync>
    </>
  );
}
