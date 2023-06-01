import { IMoveTimelineLayerTo, ITimelineTrack } from '@/types/timeline.type';

const updateTimelineLayer = (
  layer: number,
  moveTo: IMoveTimelineLayerTo,
  timelineTracks: ITimelineTrack[]
) => {
  const newTimelineTracks = [...timelineTracks];
  switch (moveTo) {
    case 'FORWARD': {
      if (layer === 1) {
        return newTimelineTracks;
      }
      
    }
  }
};

export default updateTimelineLayer;
