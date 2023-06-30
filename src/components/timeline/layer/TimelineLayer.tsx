import { useEditorSore } from '@/store';

import {
  EyeOpenIcon,
  CaretUpIcon,
  EyeClosedIcon,
  LockClosedIcon,
  LockOpen1Icon,
  ArrowUpIcon,
} from '@radix-ui/react-icons';

type Props = {
  trackHeight: number;
};

const TimelineLayer = ({ trackHeight }: Props) => {
  const allTracks = useEditorSore(state => state.timelineTracks);
  const updateTimelineLayer = useEditorSore(state => state.updateTimelineLayer);
  const updateTimelineTrack = useEditorSore(state => state.updateTimelineTrack);

  return (
    <div className=''>
      {allTracks.map(track => (
        <div
          className={`
          flex item w-full pr-1 items-center justify-around text-slate-400 shadow-sm shadow-brand-darkSecondary overflow-hidden border-r border-brand-darkSecondary border-opacity-80 `}
          style={{ height: trackHeight }}
          key={track.layer}
        >
          {/* <p className='text-[10px] text-slate-700  opacity-75 '>{track.layer}</p> */}

          {/* move layer buttons */}
          <div className=' text-brand-darkSecondary flex flex-col'>
            <div className='flex flex-col'>
              {/* forward */}

              <button
                className=' rounded-md -mb-[.95rem] cursor-pointer hover:text-opacity-75 transition-all duration-300  py-1 px-1 disabled:text-slate-700 disabled'
                disabled={track.layer === 1}
                onClick={() => updateTimelineLayer(track.id, track.layer, 'FORWARD')}
              >
                <CaretUpIcon className=' scale-[1.8]  opacity-70' />
              </button>
            </div>
            <div className='flex flex-col'>
              {/* backward */}
              <button
                className=' rounded-md  rotate-180 cursor-pointer  transition-all duration-300  py-1 px-1 disabled:text-slate-700 disabled'
                disabled={track.layer === allTracks[allTracks.length - 1].layer}
                onClick={() => updateTimelineLayer(track.id, track.layer, 'BACKWARD')}
              >
                <CaretUpIcon className='scale-[1.8]  opacity-70' />
              </button>
              {/* not using these currently */}
            </div>
          </div>
          {/* layer actions */}
          <div className='-ml-px text-brand-darkSecondary flex'>
            {/* lock layer */}
            <button
              className='mr-1.5 rounded-md px-px py-1 transition-all duration-300'
              onClick={() => {
                updateTimelineTrack(track.id, { isLocked: !track.isLocked });
              }}
            >
              {!track.isLocked ? <LockOpen1Icon /> : <LockClosedIcon />}
            </button>

            {/* show/hide layer */}
            <button
              className=' -ml-px rounded-md px-px py-1 transition-all duration-300'
              onClick={() => {
                updateTimelineTrack(track.id, { isHidden: !track.isHidden });
              }}
            >
              {!track.isHidden ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineLayer;
