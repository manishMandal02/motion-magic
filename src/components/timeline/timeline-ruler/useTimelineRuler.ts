import scaleLevels from '@/constants/defaultScaleLevels';
import { useMemo } from 'react';

type UseTimelineRulerParams = {
  scale: number;
  frameWidth: number;
  isScaleFitToTimeline: boolean;
  totalTrackDuration: number;
};

const useTimelineRuler = ({ frameWidth, scale, totalTrackDuration }: UseTimelineRulerParams) => {
  const scaleLevel = useMemo(() => scaleLevels.find(level => level.scale === scale), [scale]);

  if (!scaleLevel) throw new Error('🚀 ~ file: useTimelineRuler.ts:158:: scaleLevel level not found');

  const { framePerMarker, timeInterval, markersBetweenInterval } = scaleLevel;

  const markerWidth = framePerMarker * frameWidth;

  const totalMarkers = Math.floor(totalTrackDuration / framePerMarker);

  return {
    markerWidth,
    totalMarkers,
    timeInterval,
    markersBetweenInterval,
    framePerMarker,
  };
};

export default useTimelineRuler;
