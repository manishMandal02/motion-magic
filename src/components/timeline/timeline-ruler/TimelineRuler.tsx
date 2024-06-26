import { MouseEventHandler, memo, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import RenderTimestamp from './marker';
import useTimelineRuler from './useTimelineRuler';
import VirtualizedList from './virtualized-list';

type Props = {
  frameWidth: number;
  durationInFrames: number;
  totalTrackDuration: number;
  scale: number;
  isScaleFitToTimeline: boolean;
  onTimestampClick: (frame: number) => void;
};

const TimelineRuler = ({
  frameWidth,
  isScaleFitToTimeline,
  durationInFrames,
  onTimestampClick,
  scale,
  totalTrackDuration,
}: Props) => {
  const { markerWidth, markersBetweenInterval, timeInterval, totalMarkers, framePerMarker } =
    useTimelineRuler({
      totalTrackDuration,
      frameWidth,
      isScaleFitToTimeline,
      scale,
    });

  // used in calculating the where the user clicked on the ruler
  const timelineRulerWrapperRef = useRef<HTMLDivElement>(null);

  const handleTimestampClick: MouseEventHandler<HTMLDivElement> = ev => {
    const clickX = ev.clientX - timelineRulerWrapperRef.current!.getBoundingClientRect().left || 0;

    let targetFrame = Math.round(clickX / frameWidth);

    if (targetFrame < 1) {
      targetFrame = 0;
    }

    if (targetFrame > (durationInFrames || totalTrackDuration)) {
      targetFrame = durationInFrames;
    }

    onTimestampClick(Number(targetFrame));
  };

  // last marker (as per video length)
  const lastActiveMarker = durationInFrames / framePerMarker;

  const RenderTimestampProps = {
    timeInterval,
    markersBetweenInterval,
    totalMarkers,
    framePerMarker,
    lastActiveMarker,
  };

  console.log('🚀 ~ file: TimelineRuler.tsx:62 ~ totalMarkers:', totalMarkers);

  // total ruler width based on weather the scale if fit-to-timeline or not
  const rulerWidth = frameWidth * totalTrackDuration;

  return (
    <div className='relative'>
      {markerWidth && totalMarkers ? (
        <div
          className='w-full h-full cursor-pointer select-none '
          onMouseDown={handleTimestampClick}
          ref={timelineRulerWrapperRef}
        >
          <VirtualizedList
            width={rulerWidth}
            frameWidth={frameWidth}
            isScaleFitToTimeline={isScaleFitToTimeline}
            markerWidth={markerWidth}
            totalMarkers={totalMarkers}
            childrenProps={RenderTimestampProps}
          >
            {RenderTimestamp}
          </VirtualizedList>
          <div className={`absolute bottom-0  left-0 w-[.15px] h-3 bg-slate-500`}>
            <div className='bottom-2.5 absolute text-slate-400 text-[8px]'>{0}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(TimelineRuler);
