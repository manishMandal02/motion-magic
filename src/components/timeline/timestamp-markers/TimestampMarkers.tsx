import framesToSeconds from '@/utils/common/framesToSeconds';
import { MouseEventHandler, useMemo, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import RenderTimestamp from './marker';

type Props = {
  fps: number;
  frameWidth: number;
  durationInFrames: number;
  timelineWidth: number;
  scale: number;
  onTimestampClick: (frame: number) => void;
};

const TimestampMarkers = ({
  fps,
  frameWidth,
  timelineWidth,
  durationInFrames,
  onTimestampClick,
  scale,
}: Props) => {
  console.log('🚀 ~ file: TimestampMarkers.tsx:24 ~ frameWidth:', frameWidth);

  const timestampWrapperRef = useRef<HTMLDivElement>(null);

  const handleTimestampClick: MouseEventHandler<HTMLDivElement> = ev => {
    const clickX = ev.clientX - timestampWrapperRef.current!.getBoundingClientRect().left || 0;

    let targetFrame = Math.round(clickX / frameWidth);

    if (targetFrame < 1) {
      targetFrame = 0;
    }

    if (targetFrame > durationInFrames) {
      targetFrame = durationInFrames;
    }

    onTimestampClick(Number(targetFrame));
  };

  //
  const calculateTimestampInterval = (duration: number) => {
    let numMarker = 10;
    if (duration % 12 === 0) {
      numMarker = 12;
    }

    if (duration <= 10) {
      numMarker = duration;
    }

    return Math.round(duration / numMarker);
  };


  const durationInSeconds = useMemo(() => framesToSeconds(durationInFrames), [durationInFrames]);

  const markerWidth = useMemo(() => frameWidth * fps, [fps, frameWidth]);

  const totalMarkers = useMemo(() => Math.round(timelineWidth / markerWidth), [markerWidth, timelineWidth]);

  const timestampInterval = calculateTimestampInterval(durationInSeconds);

  const RenderTimestampProps = {
    timestampInterval,
    markerWidth,
    frameWidth,
    totalMarkers,
  };

  // to force re-render the list
  const listKey = useMemo(() => markerWidth.toString(), [markerWidth]);

  return (
    <div className='relative w-full h-full m-0 p-0  '>
      {markerWidth && timestampInterval ? (
        <div
          className='w-full h-full cursor-pointer m-0 p-0 '
          onMouseDown={handleTimestampClick}
          ref={timestampWrapperRef}
        >
          <List
            overscanCount={0}
            height={25}
            key={listKey}
            itemCount={totalMarkers}
            itemSize={index => {
              if (index === 0) {
                return markerWidth + frameWidth;
              } else {
                return markerWidth;
              }
            }}
            layout='horizontal'
            width={frameWidth * (durationInFrames + 1)}
            itemData={RenderTimestampProps}
          >
            {RenderTimestamp}
          </List>
          <div className={`absolute bottom-0  left-0 w-[.1rem] h-3 bg-slate-500`}>
            <div className='bottom-2.5 absolute text-slate-400 text-[8px]'>{0}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TimestampMarkers;
