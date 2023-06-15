const calculateTimestampInterval = (duration: number) => {
  let numMarker = 10;
  if (duration % 12 === 0) {
    numMarker = 12;
  }

  if (duration <= 10) {
    numMarker = duration;
  }

  return Math.round(duration / numMarker);
};

// marker size (for most)
const MARKER_SIZE = 35;
//increase frame-width size if two scales have same time interval
const INCREASE_FRAME_WIDTH_BY_PERCENT = 15;

type ScaleLevel = {
  scale: number; // in seconds
  timeInterval: number; // in seconds
  framePerMarker: number;
  markersBetweenInterval: number; // interval marker not included
};

const scaleLevels: ScaleLevel[] = [
  {
    scale: 1,
    framePerMarker: 500,
    timeInterval: 300,
    markersBetweenInterval: 14,
  },
  {
    scale: 2,
    framePerMarker: 125,
    timeInterval: 60,
    markersBetweenInterval: 11,
  },
  {
    scale: 3,
    framePerMarker: 50,
    timeInterval: 30,
    markersBetweenInterval: 14,
  },
  {
    scale: 4,
    framePerMarker: 25,
    timeInterval: 15,
    markersBetweenInterval: 14,
  },
  {
    scale: 5,
    framePerMarker: 12.5,
    timeInterval: 5,
    markersBetweenInterval: 9,
  },
  {
    scale: 6,
    framePerMarker: 12.5,
    timeInterval: 5,
    markersBetweenInterval: 9,
  },
  {
    scale: 7,
    framePerMarker: 12.5,
    timeInterval: 2.5,
    markersBetweenInterval: 4,
  },
  {
    scale: 8,
    framePerMarker: 5,
    timeInterval: 1,
    markersBetweenInterval: 4,
  },
  {
    scale: 9,
    framePerMarker: 5,
    timeInterval: 1,
    markersBetweenInterval: 4,
  },
  {
    scale: 10,
    framePerMarker: 2.5,
    timeInterval: 0.5,
    markersBetweenInterval: 4,
  },
  {
    scale: 11,
    framePerMarker: 1,
    timeInterval: 0.2, // 5 frame
    markersBetweenInterval: 4,
  },
  {
    scale: 12,
    framePerMarker: 1,
    timeInterval: 0.2, //5 frame
    markersBetweenInterval: 4,
  },
];

const getInitialTimelineScale = (durationInSeconds: number) => {
  // using if statements instead of switch for clear reading
  if (durationInSeconds >= 300) {
    return scaleLevels[0].scale;
  }

  if (durationInSeconds < 300 && durationInSeconds >= 60) {
    return scaleLevels[1].scale;
  }

  if (durationInSeconds < 60 && durationInSeconds >= 30) {
    return scaleLevels[2].scale;
  }
  if (durationInSeconds < 30 && durationInSeconds >= 15) {
    return scaleLevels[3].scale;
  }
  if (durationInSeconds < 15 && durationInSeconds >= 5) {
    return scaleLevels[5].scale;
  }
  return scaleLevels[7].scale;
};

type CalculateFrameWidthParams = {
  currentScale: number;
  durationInFrames: number;
  timelineWidth: number;
  isScaleFitToTimeline: boolean;
};

//TODO: return FW & marker width here (as the calculation for both are very related)
// get frame width based on scale and  total frames
const calculateFrameWidth = ({
  durationInFrames,
  isScaleFitToTimeline,
  currentScale,
  timelineWidth,
}: CalculateFrameWidthParams): number => {
  // if scale it fit to timeline
  if (isScaleFitToTimeline) {
    return timelineWidth / durationInFrames;
  }

  const scaleLevel = scaleLevels.find(level => level.scale === currentScale);

  if (!scaleLevel) return 1;

  const { framePerMarker, scale } = scaleLevel;

  // adding extra size to frame width because few scale have same time interval
  //
  if (scale === 6) {
    return (
      framePerMarker / MARKER_SIZE + (framePerMarker / MARKER_SIZE / 100) * INCREASE_FRAME_WIDTH_BY_PERCENT
    );
  }

  if (scale === 9) {
    // extra 1.5 because the previous scale (8) values (interval, framePerMarker)
    return (
      framePerMarker / MARKER_SIZE + (framePerMarker / MARKER_SIZE / 100) * INCREASE_FRAME_WIDTH_BY_PERCENT
    );
  }

  if (scale === 12) {
    // extra 1.5 because the previous scale values (interval, framePerMarker)
    return (
      framePerMarker / MARKER_SIZE +
      (framePerMarker / MARKER_SIZE / 100) * (INCREASE_FRAME_WIDTH_BY_PERCENT * 1.5)
    );
  }

  return framePerMarker / MARKER_SIZE;
};

//get marker width based on weather scale is fit to timeline or not
const getMarkerWidth = (
  isScaleFitToTimeline: boolean,
  frameWidth: number,
  currentScale: number,
  timelineWidth: number,
  durationInFrames: number
) => {
  //get current scale level
  const scaleLevel = scaleLevels.find(level => level.scale === currentScale);

  if (!scaleLevel) return 1;
  const { scale, framePerMarker } = scaleLevel;

  // fit scale to timeline width
  if (isScaleFitToTimeline) {
    return timelineWidth / durationInFrames;
  }

  return MARKER_SIZE;
};

type UseTimelineRulerParams = {
  scale: number;
  frameWidth: number;
  isScaleFitToTimeline: boolean;
  durationInSeconds: number;
};

const useTimelineRuler = ({
  frameWidth,
  scale,
  durationInSeconds,
  isScaleFitToTimeline,
}: UseTimelineRulerParams) => {
  //TODO: NOTE::💡 scale will be calculated before rendering timeline

  //TODO: calculate number of markers
  //TODO: we know marker width, num of markers, frame width, time interval - so send these data as return value from this hook

  //TODO: in the render timestamp marker: show formatted time value of interval markers

  //TODO: render extra time duration (empty space) on the timeline to allow elements to be able to dragged and increase total duration --
  //TODO: -- we can set default extra duration value (like 2.5 min) and also calculate 2x or 1.5x based on the total duration
  

  const markerWidth = 35;
  if (scale === 1) {
  }
};

export default useTimelineRuler;
