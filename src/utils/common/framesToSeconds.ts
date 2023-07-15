import { projectConstants } from '@/constants/projectConstants';
import { roundedToFixed } from './formatNumber';

const framesToSeconds = (frames: number, decimalPlace = 2) => {
  return Number(roundedToFixed(frames / projectConstants.FPS, 1));
};

export default framesToSeconds;
