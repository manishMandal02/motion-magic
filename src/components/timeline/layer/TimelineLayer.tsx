import { useEditorSore } from '@/store';
import { IMoveTimelineLayerTo } from '@/types/timeline.type';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

type Props = {
  trackHeight: number;
};

const TimelineLayer = ({ trackHeight }: Props) => {
  const allTracks = useEditorSore((state) => state.timelineTracks);

  const handleLayerChange = (move: IMoveTimelineLayerTo) => {
    if (move === 'FORWARD') {
      // handel layer change to up
    } else {
      // handel layer change to down
    }
  };

  return (
    <div className='w-full h-full flex flex-col relative '>
      <div className='flex sticky top-0 items-center justify-center  border-r border-slate-600  font-light text-slate-300 text-xs z-50 py-[0.25rem] pr-2 bg-slate-700'>
        Layer
      </div>
      <div className='relative'>
        {allTracks.map((track) => (
          <div
            className={`
          flex item items-center justify-between px-2 text-slate-400
          shadow-sm shadow-slate-700 
          `}
            style={{ height: trackHeight }}
            key={track.layer}
          >
            {/* layer info */}
            <div className=' pt-px text-slate-500'>
              <div
                className=' rounded-md rotate-90  cursor-pointer  -mb-1.5 hover:bg-slate-700 transition-all duration-300  py-1 px-1'
                onClick={() => handleLayerChange('FORWARD')}
              >
                <MdOutlineArrowBackIosNew size={16} className='scale-150' />
              </div>
              <div
                className=' rounded-md  -rotate-90 cursor-pointer  hover:bg-slate-700 transition-all duration-300  py-1 px-1'
                onClick={() => handleLayerChange('BACKWARD')}
              >
                <MdOutlineArrowBackIosNew size={16} className='scale-150' />
              </div>
            </div>
            <p className=''>{track.layer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineLayer;
