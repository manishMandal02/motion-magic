import { projectConstants } from '@/constants/projectConstants';
import { IMoveTimelineLayerTo, TimelineTrack } from '@/types/timeline.type';
import { getOverlappingElements } from '@/utils/timeline/getOverlappingElements';
import updateTimelineLayer from '@/utils/zustand/updateTimlineLayer';
import { produce } from 'immer';
import type { StateCreator } from 'zustand';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
export interface ITimelineState {
  currentFrame: number;
  setCurrentFrame: (time: number) => void;
  durationInFrames: number;
  setDurationInFrames: (duration: number) => void;
  timelineTracks: TimelineTrack[];
  isScaleFitToTimeline: boolean;
  setIsScaleFitToTimeline: (value: boolean) => void;
  updateTrackElFrame: (
    elementId: string,
    startFrame: number,
    endFrame: number,
    newTrackLayer?: number
  ) => void;
  updateTimelineTrack: (id: string, track: RecursivePartial<TimelineTrack>) => void;
  updateTimelineLayer: (id: string, layer: number, moveTo: IMoveTimelineLayerTo) => void;
}

const createTimelineSlice: StateCreator<ITimelineState> = set => ({
  currentFrame: 0,
  durationInFrames: projectConstants.VIDEO_LENGTH,
  setCurrentFrame: time => set(() => ({ currentFrame: time })),
  setDurationInFrames: duration => set(() => ({ durationInFrames: duration })),
  isScaleFitToTimeline: true,
  setIsScaleFitToTimeline: value =>
    set(() => {
      return { isScaleFitToTimeline: value };
    }),
  timelineTracks: [],
  // Update tracks name, startFrame & endFrame of el of the track
  updateTrackElFrame: (elementId, startFrame, endFrame, newTrackLayer) =>
    set(
      produce((draft: ITimelineState) => {
        const trackWithEl = draft.timelineTracks.find(track =>
          track.elements.some(el => el.id === elementId)
        )!;

        const elementToUpdate = trackWithEl.elements.find(el => el.id === elementId);
        if (!elementToUpdate) return;

        elementToUpdate.startFrame = startFrame;
        // update total duration if element is moved beyond current limits
        if (elementToUpdate.endFrame > draft.durationInFrames) {
          draft.durationInFrames = elementToUpdate.endFrame;
          draft.isScaleFitToTimeline = false;
        }
        elementToUpdate.endFrame = endFrame;
        // update element track
        if (typeof newTrackLayer !== 'undefined') {
          console.log('🚀 ~ file: timeline.ts:50 ~ produce ~ newTrackLayer:', newTrackLayer);

          // remove from old track/layer
          if (trackWithEl.elements.length === 1) {
            // delete the track if empty
            draft.timelineTracks = draft.timelineTracks.filter(track => track.id !== trackWithEl.id);
            draft.timelineTracks = draft.timelineTracks.map((track, idx) => {
              track.layer = idx + 1;
              return track;
            });
          } else {
            // remove the el from track
            trackWithEl.elements = [...trackWithEl.elements.filter(el => el.id !== elementId)];
          }
          // add el to new track/layer
          const trackToAddElTo = draft.timelineTracks.find(track => track.layer === newTrackLayer);
          if (!trackToAddElTo) return;
          trackToAddElTo.elements = [...trackToAddElTo.elements, elementToUpdate];
          // handler overlapping
          const overlappingElements = getOverlappingElements({
            elementId: elementToUpdate.id,
            elements: trackToAddElTo.elements,
            startFrame: elementToUpdate.startFrame,
            endFrame: elementToUpdate.endFrame,
          });
          if (overlappingElements.length > 0) {
            // update frame duration of overlapping elements
            for (let i = 0; i < overlappingElements.length; i++) {
              const { id, newStartFrame, newEndFrame } = overlappingElements[i];
              for (let el of trackToAddElTo.elements) {
                if (el.id === id) {
                  el.startFrame = newStartFrame;
                  el.endFrame = newEndFrame;
                }
              }
            }
          }
        }
      })
    ),
  updateTimelineTrack: (id, track) =>
    set(
      produce((draft: ITimelineState) => {
        const trackToUpdate = draft.timelineTracks.find(track => track.id === id)!;
        // update track name TODO: check if this necessary or just it on per el basis
        trackToUpdate.trackName = track.trackName ?? trackToUpdate.trackName;
        // update lock status
        if (typeof track.isLocked !== 'undefined') {
          trackToUpdate.isLocked = track.isLocked;
        }
        // update hidden status
        if (typeof track.isHidden !== 'undefined') {
          trackToUpdate.isHidden = track.isHidden;
        }
      })
    ),
  // update layer of the track based on button press forward, backward, top, bottom
  updateTimelineLayer: (id, currentLayer, moveTo) =>
    set(
      produce((draft: ITimelineState) => {
        updateTimelineLayer({
          trackId: id,
          currentLayer,
          moveTo,
          timelineTracks: draft.timelineTracks,
        });
      })
    ),
});

export { createTimelineSlice };
