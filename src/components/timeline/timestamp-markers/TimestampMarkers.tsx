import framesToSeconds from '@/utils/common/framesToSeconds';
import { MouseEventHandler, useEffect, useRef } from 'react';

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

    // calculating spacing between timestamp markers
    const spacing = calculateMarkerSpacing(duration, timelineWidth, scale);

    // draw timestamp markers
    drawTimestampMarkers(ctx, timelineWidth, spacing, canvas);
  }, [durationInFrames, timelineWidth, scale]);

  // Helper function to calculate spacing between timestamp markers
  const calculateMarkerSpacing = (duration: number, width: number, scale: number) => {
    let totalUnits = duration;

    const markerCount = Math.ceil(totalUnits / scale);

    return width / markerCount;
  };

  // Helper function to draw timestamp markers
  const drawTimestampMarkers = (
    ctx: CanvasRenderingContext2D,
    timelineWidth: number,
    spacing: number,
    canvas: HTMLCanvasElement
  ) => {
    fixDPI(canvas, dpi);
    ctx.beginPath();
    ctx.lineWidth = 0.65;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = '#7a7a7a';
    ctx.fillStyle = '#7a7a7a';
    ctx.font = '12px Arial';

    let markerPosition = 0;
    let timestamp = 0;
    const tolerance = 0.01; // Adjust the tolerance value as needed

    while (markerPosition <= timelineWidth + tolerance) {
      console.log('🚀 ~ file: TimestampMarkers.tsx:113 ~ markerPosition:', markerPosition);
      const timeValue = formatTimestamp(timestamp);

      console.log('🚀 ~ file: TimestampMarkers.tsx:115 ~ timeValue:', timeValue);
      console.log('🪄', Math.abs(markerPosition - timelineWidth) < Number.EPSILON);

      if (markerPosition === 0) {
        // for the first stamp
        ctx.moveTo(markerPosition + 1 * dpi, 30);
        ctx.lineTo(markerPosition + 1 * dpi, canvasRef.current?.height! - 1);
        ctx.stroke();

        ctx.fillText(timeValue, markerPosition * dpi, 26);
      } else if (Math.floor(markerPosition) >= timelineWidth || Math.ceil(markerPosition) >= timelineWidth) {
        console.log('🔥 reached last stamp');
        // for the last stamp
        ctx.moveTo((markerPosition - spacing * 0.05) * dpi, 30);
        ctx.lineTo((markerPosition - spacing * 0.05) * dpi, canvasRef.current?.height! - 1);
        ctx.stroke();

        ctx.fillText(timeValue, (markerPosition - 7.5) * dpi, 26);
      } else {
        // rest of the stamps
        ctx.moveTo(markerPosition * dpi, 30);
        ctx.lineTo(markerPosition * dpi, canvasRef.current?.height! - 1);
        ctx.stroke();

        ctx.fillText(timeValue, (markerPosition - 1.5) * dpi, 26);
      }

      markerPosition += spacing;
      timestamp += scale;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return Math.floor(timestamp).toString();
  };

  const handleTimestampClick: MouseEventHandler<HTMLCanvasElement> = (ev) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ev.clientX - rect.left;

    const targetFrame = Number(Math.floor(clickX * frameWidth)).toFixed(0);

    console.log('🚀 ~ file: TimestampMarkers.tsx:124 ~ targetFrame:', targetFrame);

    onTimestampClick(Number(targetFrame));
  };

  return <canvas ref={canvasRef} onClick={handleTimestampClick} className='w-full h-full' />;
};

export default TimestampMarkers;
