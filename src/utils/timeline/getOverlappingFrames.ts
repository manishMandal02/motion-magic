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
  // checking if other elements have same end frame
  for (const track of tracks) {
    // loop through all the elements of the current track
    for (const element of track.elements) {
      // check for overlapping start frame`
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
    }
  }
  console.log('🚀 ~ file: getOverlappingFrames.ts:45 ~ overlappingFrames:', overlappingFrames);
  return overlappingFrames;
};
export { getOverlappingFrames };
