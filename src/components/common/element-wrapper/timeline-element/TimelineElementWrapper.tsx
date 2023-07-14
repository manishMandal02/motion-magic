import { MouseEvent, MutableRefObject, ReactNode, useEffect, useState } from 'react';
import { DraggableData, Rnd } from 'react-rnd';
import { IElementFrameDuration } from '@/types/elements.type';
import throttle from 'raf-throttle';
import Tooltip from '../../tooltip';
import { toTwoDigitsNum } from '@/utils/common/formatNumber';
import framesToSeconds from '@/utils/common/framesToSeconds';
import { DraggableEventHandler } from 'react-draggable';

export type TooltipRef = {
  elementId: string;
  startFrame: number;
  endFrame: number;
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

  const [isResizingORDragging, setIsResizingORDragging] = useState(false);

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
          setIsResizingORDragging(true);
        }}
        onResizeStart={() => {
          setIsResizingORDragging(true);
        }}
        onDragStop={(_e, d) => {
          onDragStop();
          setPosition(prevPos => ({ ...prevPos, y: ELEMENT_POS_Y }));
          resetRefLines();
          setIsResizingORDragging(false);
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
          setIsResizingORDragging(false);
        }}
        dragAxis='both'
        dragGrid={[frameWidth, 1]}
        resizeGrid={[frameWidth, frameWidth]}
        className={`rounded-md transition-opacity outline border-offset-1 duration-150   select-none
        ${isResizingORDragging && 'opacity-[.85] border-opacity-100 border-2 border-slate-100 z-10'}
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
        <Tooltip
          content={toTwoDigitsNum(framesToSeconds(showTooltipRef.current.startFrame, 1)).toString()}
          position={'top-left'}
          isOpen={isResizingORDragging && !!showTooltipRef.current.startFrame}
        >
          <Tooltip
            content={toTwoDigitsNum(framesToSeconds(showTooltipRef.current.endFrame, 1)).toString()}
            position={'top-right'}
            isOpen={isResizingORDragging && !!showTooltipRef.current.endFrame}
          >
            {children}
          </Tooltip>
        </Tooltip>
      </Rnd>
    </>
  );
};

export default TimelineElementWrapper;
