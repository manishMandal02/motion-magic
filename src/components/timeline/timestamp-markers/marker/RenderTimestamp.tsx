import { FC, memo } from 'react';
import { ListChildComponentProps, areEqual } from 'react-window';

type Props = {
  timestampInterval: number;
  markerSpacing: number;
  frameWidth: number;
};

const RenderTimestamp: FC<ListChildComponentProps<Props>> = ({ index, style, data }) => {
  const { timestampInterval, markerSpacing, frameWidth } = data;

  // show timestamp value based on intervals
  const timestampValue =
    Math.floor(index + 1) % timestampInterval === 0 ? Math.floor(index + 1).toString() : null;

  let spacing = markerSpacing;
  if (spacing === 0) {
    spacing += frameWidth;
  }

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
        <div className='absolute text-slate-400 right-0'>{timestampValue}</div>
      </div>
    </>
  );
};

export default memo(RenderTimestamp, areEqual);
