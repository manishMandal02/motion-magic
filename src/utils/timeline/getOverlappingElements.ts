import { TrackElement } from '@/types/timeline.type';

type OverlappingElement = {};

type GetOverlappingElementsProps = {
  startFrame: number;
  endFrame: number;
  elements: TrackElement[];
};
//TODO:  make this fn modular in such a way that it can search for overlapping el --
//TODO:  --for for one side resize (just like getOverlappingFrame)
const getOverlappingElements = ({ startFrame, endFrame, elements }: GetOverlappingElementsProps) => {
  const overlappingElements: OverlappingElement[] = [];
  const selectedElFrameRage = [startFrame, endFrame];
  elements.forEach(el => {
    const elFrameRange = [el.startFrame, el.endFrame];
    //TODO: check if any frame are overlapping
  });

  const elCenterFrame = Math.round((endFrame - startFrame) / 2);

  return overlappingElements;
};

export { getOverlappingElements };
