import type { ReferenceLine, TimelineTrack } from '@/types/timeline.type';
import { type } from 'os';

// find all elements on the timeline that have same start & end frame
const getOverlappingFrames = (
  tracks: TimelineTrack[],
  elementId: string,
  elementLayer: number,
  startFrame?: number,
  endFrame?: number
) => {
  // storing the overlapping elements
  const overlappingFrames: ReferenceLine[] = [];
  //TODO: update this fn to use for loops instead of forEach
  // checking if other elements have same end frame
  tracks.forEach(track => {
    track.elements.forEach(element => {
      // check for overlapping start frame
      if (typeof startFrame !== 'undefined') {
        if (
          (startFrame === element.startFrame || startFrame === element.endFrame) &&
          elementId !== element.id
        ) {
          overlappingFrames.push({
            frame: startFrame,
            startTrack: elementLayer < track.layer ? elementLayer : track.layer,
            endTrack: elementLayer > track.layer ? elementLayer : track.layer,
          });
        }
      }
      // check for overlapping end frame
      if (typeof endFrame !== 'undefined') {
        if ((endFrame === element.endFrame || endFrame === element.startFrame) && elementId !== element.id) {
          overlappingFrames.push({
            frame: endFrame,
            startTrack: elementLayer < track.layer ? elementLayer : track.layer,
            endTrack: elementLayer > track.layer ? elementLayer : track.layer,
          });
        }
      }
    });
  });
  return overlappingFrames;
};
export { getOverlappingFrames };
