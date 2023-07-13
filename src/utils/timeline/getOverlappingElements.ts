import { CurrentDragElement } from '@/components/timeline/tracks/tracks-wrapper/TracksWrapper';
import { TrackElement } from '@/types/timeline.type';
import { Dispatch, SetStateAction } from 'react';

export type HandleOverlappingElementsProps = {
  elementId: string;
  startFrame: number;
  endFrame: number;
  elements: TrackElement[];
  currentDragEl: CurrentDragElement;
  setCurrentDragEl: Dispatch<SetStateAction<CurrentDragElement>>;
};
const handleOverlappingElements = ({
  elementId,
  startFrame,
  endFrame,
  elements,
  currentDragEl,
  setCurrentDragEl,
}: HandleOverlappingElementsProps) => {
  let isOverlapping = false;
  // total frames of current selected/dragging el
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
      let newStartFrame = newEndFrame - activeElTotalFrames;

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
      let newStartFrame = newEndFrame - activeElTotalFrames;

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
    // check if any elements are overlapping the selected el from left side (placeholder will be placed at the end of overlapping element)
    if (endFrame >= elCenterFrame && endFrame <= el.endFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      const newStartFrame = el.endFrame + 1;
      let newEndFrame = newStartFrame + activeElTotalFrames;

      // check for overlapping el for newEnd frame
      for (const elLoop of elements) {
        if (elLoop.startFrame <= newEndFrame && elLoop.endFrame > newStartFrame && elLoop.id !== elementId) {
          //
          newEndFrame = elLoop.startFrame - 1;
        }
      }

      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
      }));
    }

    // if the active element is overlapping full element or elements under it
    // move the placeholder to the end of the overlapping element
    if (startFrame <= el.startFrame && endFrame >= el.endFrame && el.id !== elementId) {
      isOverlapping = true;
      // Move placeholder to end of overlapping element
      const newStartFrame = el.endFrame + 1;

      let newEndFrame = newStartFrame + activeElTotalFrames;

      console.log('🚀 ~ file: getOverlappingElements.ts:132 ~ newStartFrame:', newStartFrame);

      // check for overlapping el for newEnd frame
      for (const elLoop of elements) {
        if (elLoop.startFrame <= newEndFrame && elLoop.endFrame > newStartFrame && elLoop.id !== elementId) {
          //
          newEndFrame = elLoop.startFrame - 1;
        }
      }
      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
      }));
    }
  }

  return isOverlapping;
};

export { handleOverlappingElements };
