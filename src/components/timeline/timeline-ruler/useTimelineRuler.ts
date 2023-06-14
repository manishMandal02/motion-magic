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

type ScaleMapping = {
  scale: number; // in seconds
  timeInterval: number; // in seconds
  framePerMaker: number;
  markersBetweenInterval: number; // interval marker not included
};

const scaleMapping: ScaleMapping[] = [
  {
    scale: 1,
    framePerMaker: 500,
    timeInterval: 300,
    markersBetweenInterval: 14,
  },
  {
    scale: 2,
    framePerMaker: 125,
    timeInterval: 60,
    markersBetweenInterval: 11,
  },
  {
    scale: 3,
    framePerMaker: 50,
    timeInterval: 30,
    markersBetweenInterval: 14,
  },
  {
    scale: 4,
    framePerMaker: 25,
    timeInterval: 15,
    markersBetweenInterval: 14,
  },
  {
    scale: 5,
    framePerMaker: 12,
    timeInterval: 5,
    markersBetweenInterval: 9,
  },
  {
    scale: 6,
    framePerMaker: 12,
    timeInterval: 5,
    markersBetweenInterval: 9,
  },
  {
    scale: 7,
    framePerMaker: 12,
    timeInterval: 5,
    markersBetweenInterval: 9,
  },
  {
    scale: 8,
    framePerMaker: 5,
    timeInterval: 1,
    markersBetweenInterval: 4,
  },
  {
    scale: 9,
    framePerMaker: 5,
    timeInterval: 1,
    markersBetweenInterval: 4,
  },
  {
    scale: 10,
    framePerMaker: 5,
    timeInterval: 1,
    markersBetweenInterval: 4,
  },
  {
    scale: 11,
    framePerMaker: 1,
    timeInterval: 0.2, // 5 frame
    markersBetweenInterval: 4,
  },
  {
    scale: 12,
    framePerMaker: 1,
    timeInterval: 0.2, //5 frame
    markersBetweenInterval: 4,
  },
];

const getFitTimelineScaleMapping = (durationInSeconds: number) => {
  // using if statements instead of switch for clear reading
  if (durationInSeconds >= 300) {
    return scaleMapping[0];
  }

  if (durationInSeconds < 300 && durationInSeconds >= 60) {
    return scaleMapping[1];
  }

  if (durationInSeconds < 60 && durationInSeconds >= 30) {
    return scaleMapping[2];
  }
  if (durationInSeconds < 30 && durationInSeconds >= 15) {
    return scaleMapping[3];
  }
  if (durationInSeconds < 15 && durationInSeconds >= 5) {
    return scaleMapping[5];
  }
  return scaleMapping[7];
};

type UseTimelineRulerParams = {
  scale: number;
  frameWidth: number;
  fitTimelineScale: number;
  durationInSeconds: number;
};

const useTimelineRuler = ({
  frameWidth,
  scale,
  durationInSeconds,
  fitTimelineScale,
}: UseTimelineRulerParams) => {
  //TODO: get marker width, timeline interval based on scale
  //TODO: make the frame width adjust to the scale and it's mapping. clue: FW will be calculated based on framePerMarker in ScaleMapping with DurationInFrames (it'll also change based on scale)
  //TODO: NOTE::💡 scale will be calculated before rendering timeline

  const markerWidth = 35;
  if (scale === 1) {
  }
};

export default useTimelineRuler;
