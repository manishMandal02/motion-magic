import { useEditorSore } from '@/store';
import React from 'react';

type Props = {
  trackHeight: number;
};

const TimelineLayer = ({ trackHeight }: Props) => {
  const allElements = useEditorSore((state) => state.elements);

  return (
    <div className='w-full h-full flex flex-col relative '>
      <div className='flex sticky top-0 items-center justify-center  font-medium text-slate-300 text-xs z-50 py-[0.25rem] pr-2 bg-slate-700'>
        Layer
      </div>
      <div className='relative'>
        {allElements.map((el) => (
          <div
            className={`
          flex item items-center justify-center text-slate-400
          shadow-sm shadow-slate-700 
          `}
            style={{ height: trackHeight }}
            key={el.id}
          >
            {el.layer}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineLayer;
