import { projectConstants } from '@/constants/projectConstants';

const framesToSeconds = (frames: number) => {
  return Number(Number(frames / projectConstants.FPS).toFixed(2));
};

export default framesToSeconds;
