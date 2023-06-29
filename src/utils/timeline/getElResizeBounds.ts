import { TrackElement } from '@/types/timeline.type';

export interface ResizeBound {
  startFrame: number;
  endFrame: number;
}

type GetElResizeBoundsProps = {
  elements: TrackElement[];
  startFrame: number;
  endFrame: number;
};

const getElResizeBounds = ({ elements, startFrame, endFrame }: GetElResizeBoundsProps) => {
  const resizeBounds: ResizeBound = {
    startFrame: 0,
    endFrame: Number.POSITIVE_INFINITY,
  };

  // loop all el on the same track to find the bounds
  for (let el of elements) {
    if (startFrame > el.endFrame && resizeBounds.startFrame < el.endFrame) {
      resizeBounds.startFrame = el.endFrame + 1;
    }

    if (endFrame < el.startFrame && resizeBounds.endFrame > el.startFrame) {
      resizeBounds.endFrame = el.startFrame - 1;
    }
  }

  return resizeBounds;
};

export { getElResizeBounds };
