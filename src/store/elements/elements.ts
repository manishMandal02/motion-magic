import { ITimelineState } from '../timeline';
import {
  IElement,
  IElementFrameDuration,
  IElementPosition,
  IElementSize,
  IElementType,
  IElements,
} from '@/types/editor/elements.type';
import type { StateCreator } from 'zustand';
import { produce } from 'immer';

export interface IElementsState {
  elements: IElements[];
  selectedEl: IElements | null;
  addElement: <T extends IElementType, P extends Extract<IElements, { type: T }>>(
    elType: T,
    element: P
  ) => void;
  updateEl: <T extends IElementType, P extends Partial<Extract<IElements, { type: T }>>>(
    id: string,
    elType: T,
    element: P
  ) => void;
  updateElFrameDuration: (id: string, duration: IElementFrameDuration) => void;
  setSelectedEl: (id: string | null) => void;
  setElSize: (id: string, size: IElementSize) => void;
  setElPos: (id: string, pos: IElementPosition) => void;
}

const createElementsSlice: StateCreator<IElementsState & ITimelineState, [], [], IElementsState> = (set) => ({
  elements: [],
  selectedEl: null,
  setSelectedEl: (id) =>
    set((state) => {
      const selectedEl = state.elements.find((el) => el.id === id)!;
      return { selectedEl };
    }),
  addElement: (elType, element) =>
    set((state) => {
      let topLayerCurrent = state.elements[state.elements.length - 1].layer;
      const newElement = { ...element, layer: topLayerCurrent + 1 };
      return { ...state, elements: [...state.elements, newElement] };
    }),
  updateEl: (id, elType, element) => {
    set(
      produce((draft: IElementsState) => {
        let elementToUpdate = draft.elements.find((el) => el.id === id)!;
        elementToUpdate = { ...elementToUpdate, ...element };
      })
    );
  },
  updateElFrameDuration: (id, duration) => {
    set(
      produce((draft: IElementsState) => {
        let elementToUpdate = draft.elements.find((el) => el.id === id)!;
        elementToUpdate.timeFrame = duration;
      })
    );
  },
  setElSize: (id, size) =>
    set(
      produce((draft: IElementsState) => {
        const elementToUpdate = draft.elements.find((el) => el.id === id)!;
        elementToUpdate.size.width = size.width;
        elementToUpdate.size.height = size.height;
      })
    ),
  setElPos: (id, pos) =>
    set(
      produce((draft: IElementsState) => {
        const elementToUpdate = draft.elements.find((el) => el.id === id)!;
        elementToUpdate.position.x = pos.x;
        elementToUpdate.position.y = pos.y;
      })
    ),
});

export { createElementsSlice };
