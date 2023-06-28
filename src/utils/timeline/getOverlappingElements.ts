import { TrackElement } from '@/types/timeline.type';

type OverlappingElement = {
  id: string;
  newStartFrame: number; // frame
  newEndFrame: number; // frame
};

type GetOverlappingElementsProps = {
  startFrame: number;
  endFrame: number;
  elements: TrackElement[];
};
//TODO:  make this fn modular in such a way that it can search for overlapping el --
//TODO:  --for for one side resize (just like getOverlappingFrame)
const getOverlappingElements = ({ startFrame, endFrame, elements }: GetOverlappingElementsProps) => {
  const overlappingElements: OverlappingElement[] = [];
  // element center

  const selectedElCenterFrame = startFrame + Math.round((endFrame - startFrame) / 2);

  //TODO: also check if the element goes below 0 frame duration for left overlap or above total duration for right overlap

  for (let i = 0; i < elements.length; i++) {
    // get current el
    const el = elements[i];

    const elTotalFrames = el.endFrame - el.startFrame;

    const elCenterFrame = el.startFrame + Math.round((el.endFrame - el.startFrame) / 2);

    // check if any elements are overlapping the selected el
    if (
      (startFrame < el.endFrame && startFrame > el.startFrame) ||
      (endFrame > el.startFrame && endFrame < el.endFrame) ||
      (el.startFrame > startFrame && el.endFrame < endFrame)
    ) {
      // move this element to the left
      if (elCenterFrame <= selectedElCenterFrame) {
        const newEndFrame = startFrame - 1;
        overlappingElements.push({
          id: el.id,
          newEndFrame,
          newStartFrame: Math.max(0, newEndFrame - elTotalFrames),
        });
      }

      // move this element to the right
      if (elCenterFrame >= selectedElCenterFrame) {
        const newStartFrame = endFrame + 1;

        overlappingElements.push({
          id: el.id,
          newStartFrame,
          newEndFrame: newStartFrame + elTotalFrames,
        });
      }
    }
  }

  return overlappingElements;
};

export { getOverlappingElements };
