import framesToSeconds from '@/utils/common/framesToSeconds';
import drawTimestampMarkerLines from '@/utils/timeline/drawTimestampMarkerLines';
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef } from 'react';
import { VariableSizeList as List, ListChildComponentProps } from 'react-window';
import { TIMELINE_MARGIN_X } from '../Timeline';

const fixDPI = (canvas: HTMLCanvasElement, dpi: number) => {
  //create a style object that returns width and height
  const style = {
    height() {
      return +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
    },
    width() {
      return +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
    },
  };
  //set the correct attributes for a clear canvas (no-blur)
  canvas.setAttribute('width', (style.width() * dpi).toString());
  canvas.setAttribute('height', (style.height() * dpi).toString());
};

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
  scale,
  onTimestampClick,
}: Props) => {
  console.log('🚀 ~ file: TimestampMarkers.tsx:38 ~ timelineWidth:', timelineWidth);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // dpi (Dots per Inch) sets correct pixel ration for canvas
  const dpi = window.devicePixelRatio;

  // calculate markerSpacing between timestamp markers
  const calculateMarkerSpacing = (duration: number, width: number, timeLineScale: number) => {
    const totalUnits = duration;

    const markerCount = Math.ceil(totalUnits / timeLineScale);

    return width / markerCount;
  };

  // Helper function to draw timestamp markers
  const drawTimestampMarkers = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      timelineWidthParams: number,
      markerSpacing: number,
      canvas: HTMLCanvasElement,
      duration: number
    ) => {
      console.log('🚀 ~ file: TimestampMarkers.tsx:59 ~ markerSpacing:', markerSpacing);

      fixDPI(canvas, dpi);
      ctx.beginPath();
      ctx.lineWidth = 0.75 * dpi;
      ctx.lineCap = 'butt';
      ctx.strokeStyle = '#5e5e5e';
      ctx.fillStyle = '#7a7a7a';
      const fontSize = 8 * dpi;
      ctx.font = `bold ${fontSize}px Arial`;

      let markerPosition = 0;
      let timestampMarker = 0;
      // Adjust the tolerance value as needed
      const tolerance = 0.01;

      const canvasHeight = canvasRef.current?.height!;

      const timestampInterval = calculateTimestampInterval(duration);
      while (markerPosition <= timelineWidthParams + tolerance) {
        const timestampValue = formatTimestampDuration(timestampMarker, timestampInterval);

        if (
          Math.floor(markerPosition) >= timelineWidthParams ||
          Math.ceil(markerPosition) >= timelineWidthParams
        ) {
          // last timestamp marker
          drawTimestampMarkerLines({
            ctx,
            dpi,
            canvasHeight,
            markerPosition,
            timestampValue,
          });
        } else {
          // all other timestamp makers
          drawTimestampMarkerLines({
            ctx,
            dpi,
            canvasHeight,
            markerPosition,
            timestampValue,
          });
        }

        markerPosition += markerSpacing;
        timestampMarker += scale;
      }
    },
    [dpi, scale]
  );

  const durationInSeconds = useMemo(() => {
    return framesToSeconds(durationInFrames);
  }, [durationInFrames]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // calculate time units based on durationInSeconds

    // calculating markerSpacing between timestamp markers
    const markerSpacing = calculateMarkerSpacing(durationInSeconds, timelineWidth, scale);

    // draw timestamp markers
    drawTimestampMarkers(ctx, timelineWidth, markerSpacing, canvas, durationInSeconds);
  }, [durationInFrames, timelineWidth, scale, drawTimestampMarkers]);

  const formatTimestampDuration = (timestampMarker: number, interval: number) =>
    Math.floor(timestampMarker) % interval === 0 ? Math.floor(timestampMarker).toString() : null;

  const calculateTimestampInterval = (duration: number) => {
    let numMarker = 10;
    if (duration % 12 === 0) {
      numMarker = 12;
    }

    if (duration <= 10) {
      numMarker = duration;
    }

    return Math.floor(duration / numMarker);
  };

  const handleTimestampClick: MouseEventHandler<HTMLCanvasElement> = ev => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ev.clientX - rect.left;

    let targetFrame = Math.round(clickX / frameWidth);
    if (targetFrame < 1) {
      targetFrame = 0;
    }

    if (targetFrame > durationInFrames) {
      targetFrame = durationInFrames;
    }

    onTimestampClick(Number(targetFrame));
  };

  const markerSpacing = frameWidth * fps;

  console.log('🚀 ~ file: TimestampMarkers.tsx:177 ~ frameWidth:', frameWidth);

  const totalMarkers = timelineWidth / markerSpacing;

  console.log('🚀 ~ file: TimestampMarkers.tsx:177 ~ markerSpacing:', markerSpacing);

  const RenderMarker = ({ index, style }: ListChildComponentProps) => {
    const timestampInterval = calculateTimestampInterval(durationInSeconds);

    const timestampValue = formatTimestampDuration(index + 1, timestampInterval);
    let spacing = markerSpacing;
    if (spacing === 0) {
      spacing += frameWidth;
    }

    return (
      <>
        <div
          className={`relative  text-[8px] text-slate-800 m-0 p-0
          ${index % 2 === 0 ? 'bg-cyan-500' : 'bg-emerald-400'}
          `}
          style={{ ...style }}>
          <div
            className={`absolute bottom-0 right-0
          ${!timestampValue ? 'w-px h-2 bg-slate-500' : 'w-[.1rem] h-3 bg-slate-500'}
          `}></div>
          <div className='absolute right-0'>{timestampValue}</div>
        </div>
      </>
    );
  };

  return (
    <div className='relative w-full h-full m-0 p-0 bg-red-400  '>
      {/* <canvas
        ref={canvasRef}
        onClick={handleTimestampClick}
        className='w-full h-full sticky top-0 bg-slate-400 cursor-pointer'
      /> */}
      {/* list */}
      <>
        {/* Pass all children components props through parent to avoid unnecessary rerendering */}
        <List
          overscanCount={40}
          height={25}
          itemCount={totalMarkers}
          itemSize={index => {
            if (index === 0) {
              return markerSpacing + frameWidth;
            } else {
              return markerSpacing;
            }
          }}
          layout='horizontal'
          width={timelineWidth + frameWidth}
          className={`ml-[${frameWidth * 4}px]`}>
          {RenderMarker}
        </List>
        <div className={`absolute bottom-0  left-0 w-[.1rem] h-3 bg-slate-500`}>
          <div className='bottom-2.5 absolute text-[8px]'>{0}</div>
        </div>
      </>
    </div>
  );
};

export default TimestampMarkers;
