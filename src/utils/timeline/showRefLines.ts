import { ReferenceLine, TimelineTrack } from '@/types/timeline.type';
import { getOverlappingFrames } from './getOverlappingFrames';

type ShowRefLinesProps = {
  tracks: TimelineTrack[];
  currentElId: string;
  currentTrack: number;
  startFrame: number;
  endFrame: number;
};

const getRefLines = ({
  startFrame,
  endFrame,
  tracks,
  currentElId,
  currentTrack,
}: ShowRefLinesProps): ReferenceLine[] => {
  const overlappingFrames = getOverlappingFrames(tracks, currentElId, currentTrack, startFrame, endFrame);

  if (endFrame < 1) return [];

  // get current frame
  const seekerEl = document.getElementById('timeline-seeker');
  if (!seekerEl) return [];
  const currentFrame = Number(seekerEl.getAttribute('data-current-frame')) || 0;

  // check if it's current frame (seeker)
  const isOverlappingWithSeeker = startFrame === currentFrame || endFrame === currentFrame;

  const isOverlappingFrames = overlappingFrames.length > 0;

  if (isOverlappingFrames || isOverlappingWithSeeker) {
    if (isOverlappingWithSeeker) {
      return [{ frame: currentFrame, startTrack: 1, endTrack: tracks.length + 1 }];
    } else if (isOverlappingFrames) {
      return [
        ...overlappingFrames.reduce((acc: ReferenceLine[], curr: ReferenceLine) => {
          const existingFrame = acc.find(obj => obj.frame === curr.frame);

          if (existingFrame) {
            existingFrame.startTrack = Math.min(existingFrame.startTrack, curr.startTrack);
            existingFrame.endTrack = Math.max(existingFrame.endTrack, curr.endTrack);
          } else {
            acc.push(curr);
          }
          return acc;
        }, []),
      ];
    }
  }
  return [];
};

export { getRefLines };
