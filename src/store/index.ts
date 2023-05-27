import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ITimelineState, createTimelineSlice } from './timeline';
import { IElementsState, createElementsSlice } from './elements';
import { IEditorSettingsState, createEditorSettingsSlice } from './settings';

type IEditorStore = ITimelineState & IElementsState & IEditorSettingsState;

const useEditorSore = create<IEditorStore>()(
  devtools((...a) => ({
    ...createEditorSettingsSlice(...a),
    ...createTimelineSlice(...a),
    ...createElementsSlice(...a),
  }))
);

export { useEditorSore };
