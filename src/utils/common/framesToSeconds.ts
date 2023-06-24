import { projectConstants } from '@/constants/projectConstants';

const framesToSeconds = (frames: number, decimalPlace = 2) => {
  return Number(Number(frames / projectConstants.FPS).toFixed(decimalPlace));
};

export default framesToSeconds;
