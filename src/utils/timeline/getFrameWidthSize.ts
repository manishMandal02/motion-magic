import scaleLevels from '@/constants/defaultScaleLevels';

type CalculateFrameWidthParams = {
  scale: number;
  durationInFrames: number;
  timelineWidth: number;
  isScaleFitToTimeline: boolean;
  isStartingFromZero?: boolean;
};

// marker size (for most)
const Default_MARKER_SIZE = 35;
//increase frame-width size if two scales have same time interval
const INCREASE_FRAME_WIDTH_BY_PERCENT = 8;

// get frameWidth based on scale
const getFrameWidthSize = ({
  durationInFrames,
  isScaleFitToTimeline,
  scale,
  timelineWidth,
  isStartingFromZero,
}: CalculateFrameWidthParams): number => {
  const adjustedDurationInFrames = isStartingFromZero ? durationInFrames + 1 : durationInFrames;
  // if scale is fit-to-timeline
  if (isScaleFitToTimeline) {
    return timelineWidth / adjustedDurationInFrames;
  }

  // get scale-level info from current scale
  const scaleLevel = scaleLevels.find(level => level.scale === scale);

  if (!scaleLevel) throw new Error('🚀 ~ file: useTimelineRuler.ts:158:: scaleLevel level not found');

  const { framePerMarker, scale: currentScaleLevel } = scaleLevel;

  let increaseFrameWidthBy = currentScaleLevel;

  if (framePerMarker === (currentScaleLevel > 2 && scaleLevels[scale - 2].framePerMarker)) {
    increaseFrameWidthBy += 1.5;
  }

  return (
    Default_MARKER_SIZE / framePerMarker +
    (Default_MARKER_SIZE / framePerMarker / 100) * (increaseFrameWidthBy * currentScaleLevel)
  );
};

export default getFrameWidthSize;
