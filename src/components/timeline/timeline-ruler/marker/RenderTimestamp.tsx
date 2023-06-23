import { toTwoDigitsNum } from '@/utils/common/formatNumber';
import { FC, memo } from 'react';
import { ListChildComponentProps, areEqual } from 'react-window';

export type RenderTimestampProps = {
  timeInterval: number;
  totalMarkers: number;
  lastActiveMarker: number;
  markersBetweenInterval: number;
};

const RenderTimestamp: FC<ListChildComponentProps<RenderTimestampProps>> = ({ index, style, data }) => {
  const { timeInterval, markersBetweenInterval, totalMarkers, lastActiveMarker } = data;

  // show timestamp value based on intervals
  const isTimestampMarker = (index + 1) % (markersBetweenInterval + 1) === 0 ? index + 1 : null;

  const isLastMarker = index + 1 === totalMarkers;

  const timestampValue = timeInterval * ((index + 1) / (markersBetweenInterval + 1));

  const isNonActiveMarker = lastActiveMarker < index + 1;

  return (
    <>
      <div
        className={`relative  text-[8px] text-slate-800 m-0 p-0 flex items-center justify-center
        ${index % 2 === 0 ? 'bg-cyan-40' : 'bg-emerald-40'}
        `}
        style={{
          ...style,
          ...(isNonActiveMarker
            ? {
                backgroundImage: `repeating-linear-gradient(-45deg, #2e3b4e, #353f4f 4px, #334156 1px, #2f3c4e 15px)`,
                backgroundSize: '100%',
                backgroundPosition: 'center',
              }
            : {}),
        }}
      >
        <div
          className={`absolute bottom-0 right-0
        ${!isTimestampMarker ? 'w-[.08px] h-1.5 bg-slate-500' : 'w-[.15px] h-2.5 bg-slate-500'}
        `}
        ></div>
        {isTimestampMarker ? (
          <div
            className={`absolute text-slate-400 top-[.1rem] z-10 ${!isLastMarker ? '-right-1' : 'right-0'}`}
          >
            {toTwoDigitsNum(timestampValue)}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default memo(RenderTimestamp, areEqual);
