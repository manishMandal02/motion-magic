export interface TrackElement {
  id: string;
  type: string;
  startFrame: number;
  endFrame: number;
}

export interface TimelineTrack {
  trackName: string;
  id: string;
  layer: number; // higher the layer upper the el on z-index
  isLocked: boolean;
  isHidden: boolean;
  elements: TrackElement[];
}

export interface ReferenceLine {
  frame: number;
  startTrack: number;
  endTrack: number;
}

export type IMoveTimelineLayerTo = 'FORWARD' | 'BACKWARD' | 'TOP' | 'BOTTOM';
