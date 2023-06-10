import { toTwoDigitsNum } from '@/utils/common/formatNumber';
import { FC, memo } from 'react';
import { ListChildComponentProps, areEqual } from 'react-window';

type Props = {
  timestampInterval: number;
  markerWidth: number;
  frameWidth: number;
  totalMarkers: number;
};

const RenderTimestamp: FC<ListChildComponentProps<Props>> = ({ index, style, data }) => {
  console.log('🚀 ~ file: RenderTimestamp.tsx:12 ~ index:', index);

  const { timestampInterval, markerWidth, frameWidth, totalMarkers } = data;

  // show timestamp value based on intervals
  const timestampValue = (index + 1) % timestampInterval === 0 ? index + 1 : null;

  const isLastMarker = index + 1 === totalMarkers;

  return (
    <>
      <div
        className={`relative  text-[8px] text-slate-800 m-0 p-0
        ${index % 2 === 0 ? 'bg-cyan-0' : 'bg-emerald-40'}
        `}
        style={{ ...style }}>
        <div
          className={`absolute bottom-0 right-0
        ${!timestampValue ? 'w-px h-2 bg-slate-500' : 'w-[.1rem] h-3 bg-slate-500'}
        `}></div>
        {timestampValue ? (
          <div className={`absolute text-slate-400 top-[.1rem] ${!isLastMarker ? '-right-2' : 'right-0'}`}>
            {toTwoDigitsNum(timestampValue)}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default memo(RenderTimestamp, areEqual);
