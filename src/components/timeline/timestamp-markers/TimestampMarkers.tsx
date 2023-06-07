import framesToSeconds from '@/utils/common/framesToSeconds';
import drawTimestampMarkerLines from '@/utils/timeline/drawTimestampMarkerLines';
import { MouseEventHandler, useEffect, useRef } from 'react';
import { TIMELINE_MARGIN_X } from '../Timeline';

const fixDPI = (canvas: HTMLCanvasElement, dpi: number) => {
  //create a style object that returns width and height
  let style = {
    height() {
      return +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
    },
    width() {
      return +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
    },
  };
  //set the correct attributes for a crystal clear image!
  //@ts-ignore
  canvas.setAttribute('width', style.width() * dpi);
  //@ts-ignore
  canvas.setAttribute('height', style.height() * dpi);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // dpi (Dots per Inch) sets correct pixel ration for canvas
  const dpi = window.devicePixelRatio;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // calculate time units based on duration
    const duration = framesToSeconds(durationInFrames);

    // calculating markerSpacing between timestamp markers
    const markerSpacing = calculateMarkerSpacing(duration, timelineWidth, scale);

    // draw timestamp markers
    drawTimestampMarkers(ctx, timelineWidth, markerSpacing, canvas, duration);
  }, [durationInFrames, timelineWidth, scale]);

  // Helper function to calculate markerSpacing between timestamp markers
  const calculateMarkerSpacing = (duration: number, width: number, scale: number) => {
    let totalUnits = duration;

    const markerCount = Math.ceil(totalUnits / scale);

    return width / markerCount;
  };

  // Helper function to draw timestamp markers
  const drawTimestampMarkers = (
    ctx: CanvasRenderingContext2D,
    timelineWidth: number,
    markerSpacing: number,
    canvas: HTMLCanvasElement,
    duration: number
  ) => {
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
    const tolerance = 0.01; // Adjust the tolerance value as needed

    const canvasHeight = canvasRef.current?.height!;

    const timestampInterval = calculateTimestampInterval(duration);

    while (markerPosition <= timelineWidth + tolerance) {
      const timestampValue = formatTimestampDuration(timestampMarker, timestampInterval);

      if (markerPosition === 0) {
        // first timestamp marker
        drawTimestampMarkerLines({
          ctx,
          dpi,
          canvasHeight,
          // subtracting the container margin (1 side)
          markerPosition: (TIMELINE_MARGIN_X / 4) * dpi,
          timestampValue,
        });
      } else if (Math.floor(markerPosition) >= timelineWidth || Math.ceil(markerPosition) >= timelineWidth) {
        // last timestamp marker
        drawTimestampMarkerLines({
          ctx,
          dpi,
          canvasHeight,
          // subtracting the container margin (1 side) and scrollbar width (4px)
          markerPosition: markerPosition - (TIMELINE_MARGIN_X / 4) * dpi,
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
  };

  const formatTimestampDuration = (timestampMarker: number, interval: number) => {
    return Math.floor(timestampMarker) % interval === 0 ? Math.floor(timestampMarker).toString() : null;
  };

  const calculateTimestampInterval = (duration: number) => {
    let numMarker = 10;
    if (duration % 12 === 0) {
      numMarker = 12;
    }

    if (duration <= 10) {
      numMarker = duration;
    }

    let interval = Math.floor(duration / numMarker);

    return interval;
  };

  const handleTimestampClick: MouseEventHandler<HTMLCanvasElement> = (ev) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ev.clientX - rect.left;

    console.log('🚀 ~ file: TimestampMarkers.tsx:165 ~ clickX:', clickX);

    const targetFrame = Number(Math.round(clickX / frameWidth)).toFixed(0);

    onTimestampClick(Number(targetFrame));
  };

  return (
    <div className='relative w-full h-full m-0 p-0'>
      <canvas ref={canvasRef} onClick={handleTimestampClick} className='w-full h-full sticky top-0' />;
    </div>
  );
};

export default TimestampMarkers;
