const EditorDefaults = {
  VIDEO_RESOLUTION: { WIDTH: 1920, HEIGHT: 1080 },
  SCALE: 0.35,
  FPS: 25,
  IS_VIDEO_LENGTH_FIXED: true,
  VIDEO_LENGTH: 25 * 45 * 1, //frames
} as const;

export { EditorDefaults };
