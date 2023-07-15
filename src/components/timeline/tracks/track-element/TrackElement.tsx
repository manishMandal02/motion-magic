import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';
import { IElementFrameDuration } from '@/types/elements.type';
import { ResizeBound } from '@/utils/timeline/getElResizeBounds';
import React, { Ref, forwardRef } from 'react';

type Props = {
  id: string;
  type: string;
  isTrackLocked: boolean;
};

const TrackElement = forwardRef<HTMLDivElement, Props>(({ id, type, isTrackLocked }, forwardedRef) => {
  return (
    <div
      key={id}
      ref={forwardedRef}
      className={`rounded-sm h-full  w-full flex text-xs font-medium items-center  justify-center overflow-hidden
               ${type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
             ${isTrackLocked ? 'cursor-default' : 'cursor-move'}
               `}
    >
      {type}
    </div>
  );
});

TrackElement.displayName = 'TrackElement';

export default TrackElement;
