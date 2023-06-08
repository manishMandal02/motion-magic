import { IMoveTimelineLayerTo, ITimelineTrack } from '@/types/timeline.type';

const moveTrackToLayer = (
  trackId: string,
  newLayer: number,
  currentLayer: number,
  timelineTracks: ITimelineTrack[]
) => {
  const track = timelineTracks.find((track) => track.id === trackId);
  if (!track) {
    return;
  }

  track.layer = newLayer;

  timelineTracks.forEach((otherTrack) => {
    if (otherTrack.id !== trackId) {
      if (newLayer < currentLayer && otherTrack.layer >= newLayer && otherTrack.layer < currentLayer) {
        otherTrack.layer++;
      } else if (newLayer > currentLayer && otherTrack.layer <= newLayer && otherTrack.layer > currentLayer) {
        otherTrack.layer--;
      }
    }
  });
  timelineTracks.sort((a, b) => {
    if (a.layer < b.layer) {
      return -1;
    } else {
      return 1;
    }
  });
};

type UpdateTimelineLayerProps = {
  trackId: string;
  currentLayer: number;
  moveTo: IMoveTimelineLayerTo;
  timelineTracks: ITimelineTrack[];
};

const updateTimelineLayer = ({ trackId, currentLayer, moveTo, timelineTracks }: UpdateTimelineLayerProps) => {
  const lastLayer = timelineTracks[timelineTracks.length - 1].layer;
  switch (moveTo) {
    case 'FORWARD':
      {
        moveTrackToLayer(trackId, currentLayer - 1, currentLayer, timelineTracks);
      }
      break;
    case 'BACKWARD':
      {
        moveTrackToLayer(trackId, currentLayer + 1, currentLayer, timelineTracks);
      }
      break;
    case 'TOP':
      {
        moveTrackToLayer(trackId, 1, currentLayer, timelineTracks);
      }
      break;
    case 'BOTTOM':
      {
        moveTrackToLayer(trackId, lastLayer, currentLayer, timelineTracks);
      }
      break;
    default: {
      timelineTracks;
    }
  }
};

export default updateTimelineLayer;
