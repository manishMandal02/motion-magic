import { MouseEvent, MutableRefObject, ReactNode, useEffect, useState } from 'react';
import { DraggableData, Rnd } from 'react-rnd';
import { IElementFrameDuration } from '@/types/elements.type';
import throttle from 'raf-throttle';
import { toTwoDigitsNum } from '@/utils/common/formatNumber';
import framesToSeconds from '@/utils/common/framesToSeconds';
import TimestampTooltip from '@/components/timeline/tracks/timeline-element/timestamp-tooltip';

export type TooltipRef = {
  elementId: string;
  startFrame: number | null;
  endFrame: number | null;
};

type Props = {
  children: ReactNode;
  frameWidth: number;
  width: number;
  height: number;
  translateX: number;
  isLocked: boolean;
  updateElFrameDuration: (id: string, duration: IElementFrameDuration) => void;
  onDrag: (deltaX: number, data: DraggableData, e: MouseEvent<HTMLElement>) => void;
  handleResize: (deltaWidth: number, direction: 'left' | 'right') => void;
  resetRefLines: () => void;
  showTooltipRef: MutableRefObject<TooltipRef>;
  onDragStop: () => void;
  onDragStart: () => void;
};

// extra el pos on Y axis
const ELEMENT_POS_Y = 3;

const TimelineElementWrapper = ({
  children,
  frameWidth,
  width,
  height,
  isLocked,
  translateX,
  onDrag,
  handleResize,
  resetRefLines,
  showTooltipRef,
  onDragStop,
  onDragStart,
}: Props) => {
  const [position, setPosition] = useState({ x: translateX, y: ELEMENT_POS_Y });

  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPosition(prev => ({ ...prev, x: translateX }));
  }, [translateX]);

  return (
    <>
      <Rnd
        size={{ width, height }}
        position={{ x: position.x, y: position.y }}
        onDrag={throttle((e, data) => {
          setPosition({ x: data.x, y: data.y });

          onDrag(data.x - position.x, data, e);
        })}
        onDragStart={() => {
          onDragStart();
          setIsDragging(true);
        }}
        onDragStop={(_e, d) => {
          onDragStop();
          setPosition(prevPos => ({ ...prevPos, y: ELEMENT_POS_Y }));
          resetRefLines();
          setIsDragging(false);
        }}
        onResizeStart={() => {
          setIsResizing(true);
        }}
        // @ts-ignore
        onResize={throttle((_e, direction, ref: HTMLDivElement) => {
          const newWidth = ref.clientWidth;

          if (direction === 'left') {
            handleResize(newWidth - width, 'left');
          }
          if (direction === 'right') {
            handleResize(newWidth - width, 'right');
          }
        })}
        onResizeStop={() => {
          resetRefLines();
          setIsResizing(false);
        }}
        dragAxis='both'
        dragGrid={[frameWidth, 1]}
        resizeGrid={[frameWidth, frameWidth]}
        className={`rounded-md transition-opacity outline border-offset-1 duration-150   select-none
        ${(isResizing || isDragging) && 'opacity-[.85] border-opacity-100 border-2 border-slate-100 z-10'}
        ${!isLocked && 'hover:border-2 hover:border-slate-300'}
        `}
        style={{
          position: 'absolute',
        }}
        disableDragging={isLocked}
        bounds={'.tracksContainer'}
        enableResizing={{
          top: false,
          topLeft: false,
          topRight: false,
          right: !isLocked ? true : false,
          left: !isLocked ? true : false,
          bottom: false,
          bottomLeft: false,
          bottomRight: false,
        }}
      >
        <TimestampTooltip
          startTime={showTooltipRef.current.startFrame}
          endTime={showTooltipRef.current.endFrame}
          isOpen={isResizing && (!!showTooltipRef.current.startFrame || !!showTooltipRef.current.endFrame)}
        >
          {children}
        </TimestampTooltip>
      </Rnd>
    </>
  );
};

export default TimelineElementWrapper;
