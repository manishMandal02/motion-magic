'use client';

import { MouseEventHandler, UIEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import TimelineTracks from './tracks';
import TimelineRuler from './timeline-ruler';
import TimelineLayer from './layer';
import { useEditorSore } from '@/store';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import TimelineSeeker from './scrubber';
import VideoControls from './video-controls';
import getFrameWidthSize from '@/utils/timeline/getFrameWidthSize';
import getInitialTimelineScale from '@/utils/timeline/getInitialTimelineScale';

const TIMELINE_TRACK_HEIGHT = 40;
// have to manually change scroll bar width from globals.css i if changed here
export const TIMELINE_SCROLLBAR_WIDTH = 7;

export default function Timeline() {
  //local state
  const [scale, setScale] = useState(1);
  const [timelineTrackScrollableWidth, setTimelineTrackScrollableWidth] = useState(0);
  const [timelineTrackVisibleWidth, setTimelineTrackVisibleWidth] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [isScaleFitToTimeline, setIsScaleFitToTimeline] = useState(false);

  // global state
  const fps = useEditorSore(state => state.fps);
  const currentFrame = useEditorSore(state => state.currentFrame);
  const setCurrentFrame = useEditorSore(state => state.setCurrentFrame);
  // const isVideoLengthFixed = useEditorSore(state => state.isVideoLengthFixed);
  const durationInFrames = useEditorSore(state => state.durationInFrames);

  // get timeline width
  useEffect(() => {
    const timelineWrapper = document.getElementById('timeline-tracks-wrapper');
    if (!timelineWrapper) return;
    setTimelineTrackScrollableWidth(timelineWrapper.scrollWidth);
    setTimelineTrackVisibleWidth(timelineWrapper.clientWidth);
  }, [scale]);

  useEffect(() => {
    const initialTimelineScale = getInitialTimelineScale(durationInFrames);

    setIsScaleFitToTimeline(true);
    setScale(initialTimelineScale);
  }, [durationInFrames]);

  // get frameWidth
  useEffect(() => {
    if (timelineTrackScrollableWidth) {
      const frameWidthSize = getFrameWidthSize({
        scale,
        durationInFrames,
        timelineTrackWidth: !isScaleFitToTimeline ? timelineTrackScrollableWidth : timelineTrackVisibleWidth,
        isScaleFitToTimeline,
        // isStartingFromZero: true,
      });
      setFrameWidth(frameWidthSize);
    }
  }, [
    scale,
    timelineTrackScrollableWidth,
    durationInFrames,
    isScaleFitToTimeline,
    timelineTrackVisibleWidth,
  ]);

  // calculate total track length in frames (more than total video length)
  const totalTrackDuration = useMemo(
    () => durationInFrames + timelineTrackVisibleWidth / frameWidth / 1.75,
    [durationInFrames, frameWidth, timelineTrackVisibleWidth]
  );

  // timeline width based on total frame
  const totalFrameWidth = useMemo(() => {
    return frameWidth * totalTrackDuration;
  }, [frameWidth, totalTrackDuration]);

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
    setIsScaleFitToTimeline(false);
  };

  // seeker should stick to top when the timeline container is scrolled
  const [scrollYPos, setScrollYPos] = useState(0);

  const handleTimelineScroll: UIEventHandler<HTMLDivElement> = ev => {
    setScrollYPos(ev.currentTarget.scrollTop);
  };

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
      <ScrollSync horizontal={false} vertical={true}>
        {/* parent container */}
        <div className='h-[28vh] w-[100vw] bg-pink-600  overflow-hidden relative  flex'>
          {/* timeline layers */}
          <ScrollSyncPane>
            <div className='flex-none flex w-[3vw] flex-col relative  z-10 bg-brand-darkPrimary  h-[28vh] pb-[6px] overflow-y-auto overflow-x-hidden  CC_hideScrollBar  '>
              <div className='flex sticky top-0 h-[3vh] items-center justify-center bg-brand-darkSecondary z-30 font-light text-slate-300 text-xs py-[0.25rem] pr-2'>
                Layer
              </div>
              <div className=''>
                <TimelineLayer trackHeight={TIMELINE_TRACK_HEIGHT} />
              </div>
            </div>
          </ScrollSyncPane>
          {/* timeline tracks & timestamp wrapper */}
          <ScrollSyncPane>
            <div
              className={`flex-auto w-[97vw] relative h-[28vh]   flex flex-col   overflow-scroll bg-emerald-700 `}
              id='timeline-tracks-wrapper'
              onScroll={handleTimelineScroll}
            >
              {/* timeline ruler */}
              <div
                className='overflow-hidden min-w-full h-[3vh] min-h-[3vh] bg-brand-darkSecondary  sticky top-0 z-10'
                style={{
                  width: totalFrameWidth + 'px',
                }}
              >
                <TimelineRuler
                  scale={scale}
                  frameWidth={frameWidth}
                  durationInFrames={durationInFrames}
                  totalTrackDuration={totalTrackDuration}
                  onTimestampClick={setCurrentFrame}
                  isScaleFitToTimeline={isScaleFitToTimeline}
                />
              </div>
              {/* timeline tracks */}

              <div
                className='h-[25vh] min-w-full w-full '
                style={{
                  width: totalFrameWidth + 'px',
                }}
              >
                <TimelineTracks trackHeight={TIMELINE_TRACK_HEIGHT} frameWidth={frameWidth} />
              </div>
              <TimelineSeeker
                timelineTrackScrollableWidth={durationInFrames * frameWidth}
                frameWidth={frameWidth}
                currentFrame={currentFrame}
                setCurrentFrame={setCurrentFrame}
                scrollYPos={scrollYPos}
              />
            </div>
          </ScrollSyncPane>
        </div>
      </ScrollSync>
    </>
  );
}
