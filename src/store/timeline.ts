import { projectConstants } from '@/constants/projectConstants';
import { IMoveTimelineLayerTo, ITimelineTrack } from '@/types/timeline.type';
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
  timelineTracks: ITimelineTrack[];
  updateTimelineTrack: (id: string, track: RecursivePartial<ITimelineTrack>) => void;
  updateTimelineLayer: (id: string, layer: number, moveTo: IMoveTimelineLayerTo) => void;
}

const createTimelineSlice: StateCreator<ITimelineState> = set => ({
  currentFrame: 0,
  durationInFrames: projectConstants.VIDEO_LENGTH,
  setCurrentFrame: time => set(() => ({ currentFrame: time })),
  setDurationInFrames: duration => set(() => ({ durationInFrames: duration })),
  timelineTracks: [],
  // Update tracks name, startFrame & endFrame of el of the track
  updateTimelineTrack: (id, track) =>
    set(
      produce((draft: ITimelineState) => {
        const trackToUpdate = draft.timelineTracks.find(track => track.element.id === id)!;
        trackToUpdate.trackName = track.trackName || trackToUpdate.trackName;
        trackToUpdate.element.startFrame =
          track.element?.startFrame !== undefined
            ? track.element.startFrame
            : trackToUpdate.element.startFrame;
        trackToUpdate.element.endFrame =
          track.element?.endFrame !== undefined ? track.element.endFrame : trackToUpdate.element.endFrame;
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
