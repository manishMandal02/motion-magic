import { EditorDefaults } from '@/constants/EditorDefaults';
import { IElement } from '@/types/editor/elements.type';
import type { IVideoResolution, SideMenuItems } from '@/types/editor/settings.type';
import type { StateCreator } from 'zustand';
import { IElementsState } from './elements';

export interface IEditorSettingsState {
  scale: number;
  fps: number;
  videoResolution: IVideoResolution;
  activeMenu: SideMenuItems;
  setActiveMenu: (menu: SideMenuItems) => void;
  setVideoResolution: (newRes: IVideoResolution) => void;
}

const createEditorSettingsSlice: StateCreator<
  IEditorSettingsState & IElementsState,
  [],
  [],
  IEditorSettingsState
> = (set) => ({
  scale: EditorDefaults.SCALE,
  fps: EditorDefaults.FPS,
  activeMenu: 'Settings',
  setActiveMenu: (menu) =>
    set((state) => {
      if (state.selectedEl) {
        state.setSelectedEl(null);
      }

      return { activeMenu: menu };
    }),
  videoResolution: {
    width: EditorDefaults.VIDEO_RESOLUTION.WIDTH,
    height: EditorDefaults.VIDEO_RESOLUTION.HEIGHT,
  },
  setVideoResolution: (newRes) => set(() => ({ videoResolution: newRes })),
});

export { createEditorSettingsSlice };
