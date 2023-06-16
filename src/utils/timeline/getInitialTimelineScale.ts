import scaleLevels from '@/constants/defaultScaleLevels';
import framesToSeconds from '../common/framesToSeconds';

const getInitialTimelineScale = (durationInFrames: number) => {
  const durationInSeconds = framesToSeconds(durationInFrames);
  // using if statements instead of switch for clear reading
  if (durationInSeconds >= 900) {
    return scaleLevels[0].scale;
  }

  if (durationInSeconds < 900 && durationInSeconds >= 300) {
    return scaleLevels[1].scale;
  }

  if (durationInSeconds < 300 && durationInSeconds >= 150) {
    return scaleLevels[2].scale;
  }
  if (durationInSeconds < 150 && durationInSeconds >= 75) {
    return scaleLevels[3].scale;
  }
  if (durationInSeconds < 75 && durationInSeconds >= 25) {
    return scaleLevels[4].scale;
  }

  if (durationInSeconds < 25 && durationInSeconds >= 12) {
    return scaleLevels[6].scale;
  }

  return scaleLevels[7].scale;
};

export default getInitialTimelineScale;
