import { EditorDefaults } from '@/constants/EditorDefaults';
import type { StateCreator } from 'zustand';

export interface ITimelineState {
  currentFrame: number;
  updateCurrentFrame: (time: number) => void;
  durationInFrames: number;
  setDurationInFrames: (duration: number) => void;
}

const createTimelineSlice: StateCreator<ITimelineState> = (set) => ({
  currentFrame: 0,
  durationInFrames: EditorDefaults.VIDEO_LENGTH,
  updateCurrentFrame: (time) => set(() => ({ currentFrame: time })),
  setDurationInFrames: (duration) => set(() => ({ durationInFrames: duration })),
});

export { createTimelineSlice };
