import { CurrentDragElement } from '@/components/timeline/tracks/tracks-wrapper/TracksWrapper';
import { TrackElement } from '@/types/timeline.type';
import { Dispatch, SetStateAction } from 'react';

export type HandleOverlappingElementsProps = {
  elementId: string;
  startFrame: number;
  endFrame: number;
  elements: TrackElement[];
  setCurrentDragEl: Dispatch<SetStateAction<CurrentDragElement>>;
};
const handleOverlappingElements = ({
  elementId,
  startFrame,
  endFrame,
  elements,
  setCurrentDragEl,
}: HandleOverlappingElementsProps) => {
  let isOverlapping = false;
  // element center

  // new overlapping logic
  //TODO: have run this fn recursively to check for overlapping after moving the overlapping elements and/or placeholder

  const activeElTotalFrames = endFrame - startFrame;
  if (elements.length === 1 && elements[0].id === elementId) return;

  for (let i = 0; i < elements.length; i++) {
    // get current el
    const el = elements[i];

    const elTotalFrames = el.endFrame - el.startFrame;

    const elCenterFrame = el.startFrame + Math.round((el.endFrame - el.startFrame) / 2);

    // check if any elements are overlapping the selected el from right side (placeholder will be placed at the end of overlapping element)
    if (startFrame < el.endFrame && startFrame >= elCenterFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      const newStartFrame = el.endFrame + 1;
      let newEndFrame = newStartFrame + activeElTotalFrames;

      // check for overlapping el for newState frame
      for (const elLoop of elements) {
        if (elLoop.startFrame <= newEndFrame && elLoop.endFrame > newEndFrame && elLoop.id !== elementId) {
          newEndFrame = elLoop.startFrame - 1;
        }
      }

      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
      }));
    }
    // check if any elements are overlapping the selected el from right side (placeholder will be placed at the start of overlapping element)
    if (startFrame <= elCenterFrame && startFrame >= el.startFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      const newEndFrame = el.startFrame - 1;

      console.log('🚀 ~ file: getOverlappingElements.ts:54 ~ newEndFrame:', newEndFrame);

      let newStartFrame = newEndFrame - activeElTotalFrames;

      console.log('🚀 ~ file: getOverlappingElements.ts:57 ~ newStartFrame:', newStartFrame);

      // check for overlapping el for newState frame
      for (const elLoop of elements) {
        if (elLoop.endFrame >= newStartFrame && elLoop.endFrame < newEndFrame && elLoop.id !== elementId) {
          newStartFrame = elLoop.endFrame + 1;
        }
      }
      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: Math.max(0, newStartFrame),
        endFrame: newEndFrame,
      }));
    }

    // check if any elements are overlapping the selected el from left side (placeholder will be placed at the start of overlapping element)
    if (endFrame > el.startFrame && endFrame <= elCenterFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      const newEndFrame = el.startFrame - 1;
      let newStartFrame = Math.max(0, newEndFrame - activeElTotalFrames);

      // check for overlapping el for newState frame
      for (const elLoop of elements) {
        if (elLoop.endFrame >= newStartFrame && elLoop.endFrame < newEndFrame && elLoop.id !== elementId) {
          newStartFrame = elLoop.endFrame + 1;
        }
      }

      setCurrentDragEl(prev => ({
        ...prev,
        endFrame: newEndFrame,
        startFrame: newStartFrame,
      }));
    }
    // check if any elements are overlapping the selected el from left side (placeholder will be placed at the end of overlapping element)
    if (endFrame > elCenterFrame && endFrame <= el.endFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      const newStartFrame = el.endFrame + 1;
      let newEndFrame = newStartFrame + activeElTotalFrames;

      // check for overlapping el for newState frame
      for (const elLoop of elements) {
        if (elLoop.startFrame <= newEndFrame && elLoop.endFrame > newEndFrame && elLoop.id !== elementId) {
          newEndFrame = elLoop.startFrame - 1;
        }
      }

      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
      }));
    }

    // if the active element is overlapping between two elements and there is a space/frames in between,
    // place it in between them
  }

  return isOverlapping;
};

export { handleOverlappingElements };
