import { CurrentDragElement } from '@/components/timeline/tracks/tracks-wrapper/TracksWrapper';
import { projectConstants } from '@/constants/projectConstants';
import { IMoveTimelineLayerTo, TimelineTrack } from '@/types/timeline.type';
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
  updateTrackElFrame: (elementId: string, startFrame: number, endFrame: number) => void;
  updateTimelineTrack: (id: string, track: RecursivePartial<TimelineTrack>) => void;
  updateTimelineLayerPosition: (id: string, layer: number, moveTo: IMoveTimelineLayerTo) => void;
  updateAllTimelineTracks: (
    tracks: TimelineTrack[],
    currentDragEl: CurrentDragElement,
    layer: number
  ) => void;
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
  updateTrackElFrame: (elementId, startFrame, endFrame) =>
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
        // if (typeof newTrackLayer !== 'undefined') {
        //   // add el to new track/layer
        //   const trackToAddElTo = draft.timelineTracks.find(track => track.layer === newTrackLayer);
        //   if (!trackToAddElTo) return;
        //   trackToAddElTo.elements = [...trackToAddElTo.elements, elementToUpdate];

        //   // remove the el from track
        //   trackWithEl.elements = [...trackWithEl.elements.filter(el => el.id !== elementId)];

        //   // delete the track if empty
        //   if (trackWithEl.elements.length === 0) {
        //     draft.timelineTracks = draft.timelineTracks.filter(track => track.id !== trackWithEl.id);
        //     draft.timelineTracks = draft.timelineTracks.map((track, idx) => {
        //       track.layer = idx + 1;
        //       return track;
        //     });
        //   }
        // }
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
  updateTimelineLayerPosition: (id, currentLayer, moveTo) =>
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
  updateAllTimelineTracks: (tracks, currentDragEl, layer) =>
    set(
      produce((draft: ITimelineState) => {
        const currentTrackWithEl = draft.timelineTracks.find(track => track.layer === layer);
        if (!currentTrackWithEl) return;

        const elementToUpdate = currentTrackWithEl.elements.find(el => el.id === currentDragEl.id);
        if (!elementToUpdate) return;
        // update dragged element time-frame to the placeholder time-frame
        elementToUpdate.startFrame = currentDragEl.startFrame;
        elementToUpdate.endFrame = currentDragEl.endFrame;

        if (currentDragEl.currentTrack !== layer) {
          console.log('🚀 ~ file: TracksWrapper.tsx:407 ~ produce ~ layer:', layer);

          // add el to new track/layer
          const trackToAddElTo = draft.timelineTracks.find(
            track => track.layer === currentDragEl.currentTrack
          );
          if (!trackToAddElTo) return;

          trackToAddElTo.elements.push(elementToUpdate);

          // remove the el from track
          currentTrackWithEl.elements = [
            ...currentTrackWithEl.elements.filter(el => el.id !== currentDragEl.id),
          ];

          // delete the track if empty
          if (currentTrackWithEl.elements.length === 0) {
            draft.timelineTracks = draft.timelineTracks.filter(track => track.id !== currentTrackWithEl.id);

            // giver a layer number to each track
            draft.timelineTracks = draft.timelineTracks.map((track, idx) => {
              track.layer = idx + 1;
              return track;
            });
          }
        }
      })
    ),
});

export { createTimelineSlice };
