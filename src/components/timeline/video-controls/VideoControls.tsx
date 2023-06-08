import { toTwoDigitsNum } from '@/utils/common/formatNumber';
import framesToSeconds from '@/utils/common/framesToSeconds';
import { IoPlayForward, IoPlaySkipForwardSharp } from 'react-icons/io5';

type Props = {
  fps: number;
  currentFrame: number;
  durationInFrames: number;
  setCurrentFrame: (frame: number) => void;
};

const VideoControls = ({ fps, currentFrame, setCurrentFrame, durationInFrames }: Props) => {
  const durationInSeconds = framesToSeconds(durationInFrames);

  // [frames, seconds, minutes]
  type CurrentTIme = [number, number, number];

  const getCurrentTime = (): CurrentTIme => {
    const FF = currentFrame % fps;
    const seconds = (currentFrame - FF) / fps;
    const SS = seconds % 60;
    const minutes = (seconds - SS) / 60;
    const MM = minutes % 60;
    return [FF, SS, MM];
  };

  const [frames, seconds, minutes] = getCurrentTime();

  const handleFitTimelineClick = () => {
    return 0;
  };

  return (
    <div className='flex items-center'>
      {/* controls */}
      <div className='flex text-white justify-center items-center'>
        {/* prev frame */}
        <button
          className='rotate-180 mr-1'
          onClick={() => {
            if (currentFrame === 0) return;
            setCurrentFrame(0);
          }}
        >
          <IoPlaySkipForwardSharp />
        </button>
        <button
          className='rotate-180'
          onClick={() => {
            if (currentFrame === 0) return;
            setCurrentFrame(currentFrame - 1);
          }}
        >
          <IoPlayForward />
        </button>
        {/* time */}
        <div className='mx-2 w-16'>
          <span className=' '>{toTwoDigitsNum(minutes)}</span>
          <span>:</span>
          <span className=' '>{toTwoDigitsNum(seconds)}</span>
          <span>:</span>
          <span className='opacity-60 '>{toTwoDigitsNum(frames)}</span>
        </div>
        <button
          className=''
          onClick={() => {
            if (currentFrame === durationInFrames) return;
            setCurrentFrame(currentFrame + 1);
          }}
        >
          <IoPlayForward />
        </button>
        <button
          className='ml-1'
          onClick={() => {
            if (currentFrame === durationInFrames) return;
            setCurrentFrame(durationInFrames);
          }}
        >
          <IoPlaySkipForwardSharp />
        </button>
      </div>
      {/* zoom */}
      <button
        className={`border border-slate-600 ml-4 px-1.5 text-slate-400 rounded-sm `}
        onClick={handleFitTimelineClick}
      >
        Fit
      </button>
    </div>
  );
};

export default VideoControls;
