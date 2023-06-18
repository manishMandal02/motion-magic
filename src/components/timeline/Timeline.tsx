'use client';

import { UIEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import TimelineTracks from './tracks';
import TimelineRuler from './timeline-ruler';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import TimelineSeeker from './scrubber';
import VideoControls from './video-controls';
import getFrameWidthSize from '@/utils/timeline/getFrameWidthSize';
import getInitialTimelineScale from '@/utils/timeline/getInitialTimelineScale';
import { Rnd } from 'react-rnd';
import throttle from '@/utils/common/throttle';

const TIMELINE_TRACK_HEIGHT = 40;
// have to manually change scroll bar width from globals.css i if changed here
export const TIMELINE_SCROLLBAR_WIDTH = 7;

export default function Timeline() {
  //local state
  const [scale, setScale] = useState(1);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [isScaleFitToTimeline, setIsScaleFitToTimeline] = useState(false);
  const [timelineWrapperEl, setTimelineWrapperEl] = useState<HTMLElement | null>(null);
  // scroll position of timeline scroll for seeker
  const [scrollPos, setScrollPos] = useState(0);

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
    setTimelineWidth(timelineWrapper.scrollWidth);
  }, [scale]);

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
  const totalFrameWidthPlus1 = useMemo(() => {
    if (isScaleFitToTimeline) {
      return frameWidth * (durationInFrames + 1);
    } else {
      return frameWidth * durationInFrames;
    }
  }, [frameWidth, durationInFrames, isScaleFitToTimeline]);

  const totalFrameWidth = useMemo(() => {
    if (isScaleFitToTimeline) {
      return (timelineWidth / durationInFrames) * durationInFrames;
    } else {
      return frameWidth * durationInFrames;
    }
  }, [durationInFrames, frameWidth, timelineWidth, isScaleFitToTimeline]);

  const frameWidthStartingFromOne = useMemo(
    () => getFrameWidthSize({ durationInFrames, isScaleFitToTimeline, scale, timelineWidth }),
    [durationInFrames, isScaleFitToTimeline, scale, timelineWidth]
  );

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    setIsScaleFitToTimeline(false);
  };

  // set seeker left position as tracks container is scrolled
  const scrollableAreaRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (scrollableAreaRef) {
  //     const scrollY = scrollableAreaRef.current?.scrollLeft;

  //     console.log('🚀 ~ file: Timeline.tsx:103 ~ useEffect ~ scrollY:', scrollY);
  //   }
  // }, []);

  const handleTracksContainerScroll: UIEventHandler<HTMLDivElement> = ev => {
    const scrollY = ev.currentTarget.scrollLeft;
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
          <div
            className={`flex-auto w-[97vw] relative h-full  flex flex-col  overflow-hidden bg-emerald-700 `}
            id='timeline-tracks-wrapper'
          >
            {/* timeline ruler */}
            <ScrollSyncPane>
              <div className='overflow-y-hidden overflow-x-auto h-[3vh] CC_hideScrollBar'>
                <div
                  className={`bg-brand-darkSecondary top-0 left-0 sticky  z-1 h-full `}
                  style={{
                    width: totalFrameWidthPlus1 + 'px',
                  }}
                >
                  <TimelineRuler
                    scale={scale}
                    frameWidth={frameWidth}
                    durationInFrames={durationInFrames}
                    onTimestampClick={setCurrentFrame}
                    isScaleFitToTimeline={isScaleFitToTimeline}
                  />
                </div>
              </div>
            </ScrollSyncPane>
            <ScrollSyncPane>
              {/* timeline tracks */}
              <div
                className='h-[25vh] z-auto overflow-auto min-w-full CC_customScrollBar'
                onScroll={throttle(ev => {
                  setScrollPos(ev.target.scrollLeft);
                }, 150)}
              >
                <div
                  className='h-full'
                  style={{
                    width: totalFrameWidth + 'px',
                  }}
                  ref={scrollableAreaRef}
                >
                  <TimelineTracks
                    trackHeight={TIMELINE_TRACK_HEIGHT}
                    frameWidth={frameWidthStartingFromOne}
                  />
                </div>
              </div>
            </ScrollSyncPane>
            <TimelineSeeker
              timelineWidth={
                !isScaleFitToTimeline ? totalFrameWidth - frameWidth : totalFrameWidth - frameWidth
              }
              timelineScrollLeft={scrollPos}
              frameWidth={frameWidth}
              currentFrame={currentFrame}
              setCurrentFrame={setCurrentFrame}
              lastFrame={durationInFrames}
            />
          </div>
        </div>
      </ScrollSync>
    </>
  );
}
