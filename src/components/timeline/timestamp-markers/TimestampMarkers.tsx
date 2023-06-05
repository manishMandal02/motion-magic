import { TimeUnits } from '@/types/settings.type';
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
  frameWidth: number;
  durationInFrames: number;
  timelineWidth: number;
  scale: number;
  onTimestampClick: (frame: number) => void;
};

const TimestampMarkers = ({
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

    const context = canvas.getContext('2d');

    if (!context) return;
    context.imageSmoothingEnabled = false;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate time units based on duration
    const duration = framesToSeconds(durationInFrames);
    const timeUnits = getTimeUnits(duration);

    // Calculate spacing between timestamp markers
    const spacing = calculateMarkerSpacing(duration, timelineWidth, scale, timeUnits);

    // Draw timestamp markers
    //@ts-ignore
    drawTimestampMarkers(context, timelineWidth, spacing, canvas);
  }, [durationInFrames, timelineWidth, scale]);

  // Helper function to calculate time units based on duration
  const getTimeUnits = (duration: number) => {
    let timeUnits: TimeUnits[] = ['Seconds', 'Minutes', 'Hours'];

    if (duration < 60) {
      timeUnits = ['Seconds'];
    } else if (duration < 3600) {
      timeUnits = ['Minutes', 'Seconds'];
    }

    return timeUnits;
  };

  // Helper function to calculate spacing between timestamp markers
  const calculateMarkerSpacing = (duration: number, width: number, scale: number, timeUnits: TimeUnits[]) => {
    const largestTimeUnit = timeUnits[timeUnits.length - 1];

    let totalSeconds = duration;
    if (largestTimeUnit === 'Minutes') {
      totalSeconds /= 60;
    } else if (largestTimeUnit === 'Hours') {
      totalSeconds /= 3600;
    }

    const markerCount = Math.floor(totalSeconds / scale);

    return width / markerCount;
  };

  // Helper function to draw timestamp markers
  const drawTimestampMarkers = (
    context: CanvasRenderingContext2D,
    width: number,
    spacing: number,
    canvas: HTMLCanvasElement
  ) => {
    fixDPI(canvas, dpi);
    context.beginPath();
    context.lineWidth = 1;
    context.lineCap = 'butt'; // or "butt" for sharp line endings
    context.strokeStyle = '#7a7a7a';

    let markerPosition = 0;
    while (markerPosition <= width) {
      context.moveTo(markerPosition * dpi, 20);
      context.lineTo(markerPosition * dpi, canvasRef.current?.height! - 5);
      context.stroke();
      markerPosition += spacing;
    }
  };

  const handleTimestampClick: MouseEventHandler<HTMLCanvasElement> = (ev) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ev.clientX - rect.left;

    const targetFrame = clickX * frameWidth;

    onTimestampClick(targetFrame);
  };

  return <canvas ref={canvasRef} onClick={handleTimestampClick} className='w-full h-full' />;
};

export default TimestampMarkers;
