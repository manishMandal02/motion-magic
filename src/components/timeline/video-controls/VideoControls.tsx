import Slider from '@/components/common/slider';
import { toTwoDigitsNum } from '@/utils/common/formatNumber';
import { Dispatch, SetStateAction } from 'react';
import { IoPlayForward, IoPlaySkipForwardSharp } from 'react-icons/io5';

type Props = {
  scale: number;
  updateScale: (scale: number) => void;
  setIsScaleFitToTimeline: (value: boolean) => void;
  fps: number;
  currentFrame: number;
  durationInFrames: number;
  setCurrentFrame: (frame: number) => void;
};

const ZOOM_IN_RATIO = 6;

const VideoControls = ({
  fps,
  currentFrame,
  setCurrentFrame,
  durationInFrames,
  scale,
  updateScale,
  setIsScaleFitToTimeline,
}: Props) => {
  //TODO: scale * 12.5 to get the max zoom in scale

  // [frames, seconds, minutes]
  type CurrentTIme = [number, number, number];

  const getCurrentTime = (): CurrentTIme => {
    const FF = currentFrame % fps;
    const sec = (currentFrame - FF) / fps;
    const SS = sec % 60;
    const min = (sec - SS) / 60;
    const MM = min % 60;
    return [FF, SS, MM];
  };

  const handleScaleChange = (newScale: number) => {
    updateScale(newScale);
  };

  const [frames, seconds, minutes] = getCurrentTime();

  const handleFitTimelineClick = () => setIsScaleFitToTimeline(true);
  return (
    <div className='flex items-center  justify-between px-8 h-full w-full'>
      <div className='flex'></div>
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
      <div className='flex'>
        <div className='w-24'>
          <Slider
            value={scale}
            defaultValue={scale}
            max={12}
            min={1}
            step={1}
            onValueChange={handleScaleChange}
          />
        </div>
        <input
          type='text'
          value={scale}
          readOnly
          className='w-8 h-4.5 px-1 flex items-center justify-center rounded-sm ml-2.5'
        />
        {/* fit timeline  */}
        <button
          className={`border border-slate-600 ml-4 px-1.5 text-slate-400 rounded-sm `}
          onClick={handleFitTimelineClick}
        >
          Fit
        </button>
      </div>
    </div>
  );
};

export default VideoControls;
