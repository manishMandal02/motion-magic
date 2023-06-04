import { EditorDefaults } from '@/constants/EditorDefaults';

const framesToSeconds = (frames: number) => {
  return Number(Number(frames / EditorDefaults.FPS).toFixed(2));
};

export default framesToSeconds;
