import framesToSeconds from '../common/framesToSeconds';

type CalculateTimelineWidthProps = {
  durationFrames: number;
};
const calculateTimelineWidth = ({ durationFrames }: CalculateTimelineWidthProps) => {
  let width = 0;
  const totalSeconds = framesToSeconds(durationFrames);
  if (totalSeconds < 10) {
    width = 100;
  }

  return width;
};
