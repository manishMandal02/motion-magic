export interface ITimelineTrack {
  trackName: string;
  id: string;
  layer: number; // higher the layer upper the el on z-index
  element: {
    id: string;
    type: string;
    startFrame: number;
    endFrame: number;
  };
}

export type IMoveTimelineLayerTo = 'FORWARD' | 'BACKWARD' | 'TOP' | 'BOTTOM';
