import { ITimelineState } from './timeline';
import type { IElement, IElementPosition, IElementSize } from '@/types/editor/elements.type';
import type { StateCreator } from 'zustand';
import { produce } from 'immer';

export interface IElementsState {
  elements: IElement[];
  selectedEl: IElement | null;
  addElement: (element: IElement) => void;
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
  addElement: (element) => set((state) => ({ ...state, elements: [...state.elements, element] })),
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
