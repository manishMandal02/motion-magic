import React from 'react';

type POS = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';

type Props = {
  pos: POS;
};

type PositionStyle = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const handlePositions: Record<POS, PositionStyle> = {
  topLeft: { top: -8, left: -10 },
  topRight: { top: -8, right: -10 },
  bottomRight: { bottom: -8, right: -6 },
  bottomLeft: { bottom: -8, left: -6 },
};

const ResizablePoints = ({ pos }: Props) => {
  return (
    <>
      {/* top-left round */}
      <div
        className={`w-9 h-9 rounded-full bg-slate-100 border border-slate-400 absolute z-50`}
        style={{
          ...handlePositions[pos],
        }}
      ></div>
    </>
  );
};

export default ResizablePoints;
