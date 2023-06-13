type Params = {
  scale: number;
  frameWidth: number;
  durationInSeconds: number;
};

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

const MAX_FRAME_WIDTH = 35;
const MIN_FRAME_WIDTH = 1;

const useTimestampMarker = ({ frameWidth, scale, durationInSeconds }: Params) => {
  if (durationInSeconds === 1000) {
  }

  const markerWidth = 35;
  if (scale === 1) {
  }
};
