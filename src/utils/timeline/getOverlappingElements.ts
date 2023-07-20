import { CurrentDragElement } from '@/components/timeline/tracks/tracks-wrapper/TracksWrapper';
import { ITrackElement } from '@/types/timeline.type';
import { Dispatch, SetStateAction } from 'react';

export type HandleOverlappingElementsProps = {
  elementId: string;
  startFrame: number;
  endFrame: number;
  elements: ITrackElement[];
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
  // total frames of current selected/dragging el
  const activeElTotalFrames = endFrame - startFrame;
  if (elements.length === 1 && elements[0].id === elementId) return;

  for (let i = 0; i < elements.length; i++) {
    // get current el
    const el = elements[i];

    const elCenterFrame = el.startFrame + Math.round((el.endFrame - el.startFrame) / 2);

    // check if any elements are overlapping the selected el from right side
    // placeholder will be placed at the end of overlapping element
    if (startFrame < el.endFrame && startFrame >= elCenterFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      let newStartFrame = el.endFrame + 1;
      let newEndFrame = newStartFrame + activeElTotalFrames;
      let isOnElementConnector = false;

      // check for overlapping el for newState frame
      for (const elLoop of elements) {
        // if there is an el immediately after the overlapping el and not space/frames for the placeholder
        // then show a line representing that the current active el will be place there
        if (elLoop.startFrame === newStartFrame && elLoop.id !== elementId) {
          newStartFrame = elLoop.startFrame;
          newEndFrame = newStartFrame + activeElTotalFrames;
          isOnElementConnector = true;
        } else if (
          elLoop.startFrame <= newEndFrame &&
          elLoop.endFrame > newEndFrame &&
          elLoop.id !== elementId
        ) {
          newEndFrame = elLoop.startFrame - 1;
        }
      }

      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
        isOnElementConnector,
      }));
    }
    // check if any elements are overlapping the selected el from right side
    // placeholder will be placed at the start of overlapping element
    if (startFrame <= elCenterFrame && startFrame >= el.startFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      let newEndFrame = el.startFrame - 1;
      let newStartFrame = newEndFrame - activeElTotalFrames;
      let isOnElementConnector = false;

      // check for overlapping el for newState frame
      for (const elLoop of elements) {
        // if there is an el immediately before the overlapping el and not space/frames for the placeholder
        // then show a line representing that the current active el will be place there
        if (elLoop.endFrame === newEndFrame && elLoop.id !== elementId) {
          newStartFrame = elLoop.endFrame;
          newEndFrame = newStartFrame + activeElTotalFrames;
          isOnElementConnector = true;
        } else if (
          elLoop.endFrame >= newStartFrame &&
          elLoop.endFrame < newEndFrame &&
          elLoop.id !== elementId
        ) {
          newStartFrame = elLoop.endFrame + 1;
        }
      }
      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: Math.max(0, newStartFrame),
        endFrame: newEndFrame,
        isOnElementConnector,
      }));
    }

    // check if any elements are overlapping the selected el from the left side (of the element)
    // placeholder will be placed at the start of overlapping element
    if (endFrame > el.startFrame && endFrame <= elCenterFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      let newEndFrame = el.startFrame - 1;
      let newStartFrame = newEndFrame - activeElTotalFrames;
      let isOnElementConnector = false;

      // check for overlapping el for newState frame
      for (const elLoop of elements) {
        // if there is an el immediately before the overlapping el and not space/frames for the placeholder
        // then show a line representing that the current active el will be place there
        if (elLoop.endFrame === newEndFrame && elLoop.id !== elementId) {
          newStartFrame = elLoop.endFrame;
          newEndFrame = newStartFrame + activeElTotalFrames;
          isOnElementConnector = true;
        } else if (
          elLoop.endFrame >= newStartFrame &&
          elLoop.endFrame < newEndFrame &&
          elLoop.id !== elementId
        ) {
          newStartFrame = elLoop.endFrame + 1;
        }
      }

      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: Math.max(0, newStartFrame),
        endFrame: newEndFrame,
        isOnElementConnector,
      }));
    }
    // check if any elements are overlapping the selected el from left side
    // placeholder will be placed at the end of overlapping element
    if (endFrame >= elCenterFrame && endFrame <= el.endFrame && el.id !== elementId) {
      isOverlapping = true;
      // move the active el's placeholder after the element's end frame
      let newStartFrame = el.endFrame + 1;

      let newEndFrame = newStartFrame + activeElTotalFrames;
      let isOnElementConnector = false;

      // check for overlapping el for newEnd frame
      for (const elLoop of elements) {
        // if there is an el immediately after the overlapping el and not space/frames for the placeholder
        // then show a line representing that the current active el will be place there
        console.log('🚀 ~ file: getOverlappingElements.ts:144 ~ elLoop.startFrame:', elLoop.startFrame);
        if (elLoop.startFrame === newStartFrame && elLoop.id !== elementId) {
          newStartFrame = elLoop.startFrame;
          newEndFrame = newStartFrame + activeElTotalFrames;
          isOnElementConnector = true;
        } else if (
          elLoop.startFrame <= newEndFrame &&
          elLoop.endFrame > newStartFrame &&
          elLoop.id !== elementId
        ) {
          //
          newEndFrame = elLoop.startFrame - 1;
        }
      }

      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
        isOnElementConnector,
      }));
    }

    // if the active element is overlapping full element or elements under it
    // move the placeholder to the end of the overlapping element
    if (startFrame <= el.startFrame && endFrame >= el.endFrame && el.id !== elementId) {
      isOverlapping = true;
      // Move placeholder to end of overlapping element
      let newStartFrame = el.endFrame + 1;
      let newEndFrame = newStartFrame + activeElTotalFrames;
      let isOnElementConnector = false;

      // check for overlapping el for newEnd frame
      for (const elLoop of elements) {
        // if there is an el immediately after the overlapping el and not space/frames for the placeholder
        // then show a line representing that the current active el will be place there
        if (elLoop.startFrame === newStartFrame && elLoop.id !== elementId) {
          newStartFrame = elLoop.startFrame;
          newEndFrame = newStartFrame + activeElTotalFrames;
          isOnElementConnector = true;
        } else if (
          elLoop.startFrame <= newEndFrame &&
          elLoop.endFrame > newStartFrame &&
          elLoop.id !== elementId
        ) {
          newEndFrame = elLoop.startFrame - 1;
        }
      }
      setCurrentDragEl(prev => ({
        ...prev,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
        isOnElementConnector,
      }));
    }
  }

  return isOverlapping;
};

export { handleOverlappingElements };
