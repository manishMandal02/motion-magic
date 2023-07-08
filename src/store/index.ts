import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ITimelineState, createTimelineSlice } from './timeline';
import { IEditorSettingsState, createEditorSettingsSlice } from './settings';
import { IElementsState, createElementsSlice } from './elements/elements';

type IEditorStore = ITimelineState & IElementsState & IEditorSettingsState;

const useEditorStore = create<IEditorStore>()(
  devtools((...a) => ({
    ...createEditorSettingsSlice(...a),
    ...createTimelineSlice(...a),
    ...createElementsSlice(...a),
  }))
);

export { useEditorStore };
