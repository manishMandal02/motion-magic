import { ITimelineState } from '../timeline';
import {
  IAddElement,
  IElementPosition,
  IElementSize,
  IElements,
  IUpdateElement,
} from '@/types/elements.type';
import type { StateCreator } from 'zustand';
import { produce } from 'immer';
import { ITimelineTrack } from '@/types/timeline.type';
import { nanoid } from 'nanoid';

export interface IElementsState {
  elements: IElements[];
  selectedEl: IElements | null;
  addElement: IAddElement;
  updateEl: IUpdateElement;
  setSelectedEl: (id: string | null) => void;
  setElSize: (id: string, size: IElementSize) => void;
  setElPos: (id: string, pos: IElementPosition) => void;
}

const createElementsSlice: StateCreator<IElementsState & ITimelineState, [], [], IElementsState> = set => ({
  elements: [],
  selectedEl: null,
  setSelectedEl: id =>
    set(state => {
      const selectedEl = state.elements.find(el => el.id === id)!;
      return { selectedEl };
    }),
  addElement: (_elType, element) =>
    set(state => {
      const { id, type, startFrame, endFrame } = element;
      let topLayerCurrent = 0;
      if (state.timelineTracks.length >= 1) {
        topLayerCurrent = state.timelineTracks[state.timelineTracks.length - 1].layer;
      }
      const newTrack: ITimelineTrack = {
        id: nanoid(),
        trackName: type,
        layer: topLayerCurrent + 1,
        isHidden: false,
        isLocked: false,
        elements: [
          {
            id,
            type,
            startFrame,
            endFrame,
          },
        ],
      };

      return {
        ...state,
        elements: [...state.elements, { ...element }],
        timelineTracks: [...state.timelineTracks, newTrack],
      };
    }),
  updateEl: (id, elType, element) => {
    set(
      produce((draft: IElementsState) => {
        let elementToUpdate = draft.elements.find(el => el.id === id)!;
        elementToUpdate = { ...elementToUpdate, ...element };
      })
    );
  },
  setElSize: (id, size) =>
    set(
      produce((draft: IElementsState) => {
        const elementToUpdate = draft.elements.find(el => el.id === id)!;
        elementToUpdate.size.width = size.width;
        elementToUpdate.size.height = size.height;
      })
    ),
  setElPos: (id, pos) =>
    set(
      produce((draft: IElementsState) => {
        const elementToUpdate = draft.elements.find(el => el.id === id)!;
        elementToUpdate.position.x = pos.x;
        elementToUpdate.position.y = pos.y;
      })
    ),
});

export { createElementsSlice };
