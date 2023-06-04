import { useEditorSore } from '@/store';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

type Props = {
  trackHeight: number;
};

const TimelineLayer = ({ trackHeight }: Props) => {
  const allTracks = useEditorSore((state) => state.timelineTracks);
  const updateTimelineLayer = useEditorSore((state) => state.updateTimelineLayer);

  return (
    <div className='w-full h-full flex flex-col relative'>
      <div className='flex sticky top-0 items-center justify-center  border-r border-slate-600  font-light text-slate-300 text-xs z-[60] bg-slate-700 py-[0.25rem] pr-2'>
        Layer
      </div>
      <div className='relative'>
        {allTracks.map((track) => (
          <div
            className={`
          flex item items-center justify-between px-2 text-slate-400
          shadow-sm shadow-slate-700 
          overflow-hidden
          `}
            style={{ height: trackHeight }}
            key={track.layer}
          >
            {/* layer info */}
            <div className=' text-slate-500 flex '>
              <div className='flex flex-col '>
                {/* top */}
                <button
                  className=' rounded-md rotate-90  cursor-pointer flex flex-col relative  transition-all duration-300  py-1 px-1 disabled:text-slate-700 disabled'
                  disabled={track.layer === 1}
                  onClick={() => updateTimelineLayer(track.id, track.layer, 'TOP')}
                >
                  <MdOutlineArrowBackIosNew size={10} className='scale-150  bg-teal-300  absolute left-  ' />
                  <MdOutlineArrowBackIosNew size={10} className='scale-150 absolute left-px' />
                </button>
                {/* forward */}

                <button
                  className=' rounded-md rotate-90   cursor-pointer hover:bg-slate-700 transition-all duration-300  py-1 px-1 disabled:text-slate-700 disabled'
                  disabled={track.layer === 1}
                  onClick={() => updateTimelineLayer(track.id, track.layer, 'FORWARD')}
                >
                  <MdOutlineArrowBackIosNew size={10} className='scale-150' />
                </button>
              </div>

              <div className='flex flex-col'>
                {/* backward */}

                <button
                  className=' rounded-md  -rotate-90 cursor-pointer  hover:bg-slate-700 transition-all duration-300  py-1 px-1 disabled:text-slate-700 disabled'
                  disabled={track.layer === allTracks[allTracks.length - 1].layer}
                  onClick={() => updateTimelineLayer(track.id, track.layer, 'BACKWARD')}
                >
                  <MdOutlineArrowBackIosNew size={10} className='scale-150' />
                </button>
                {/* bottom */}
                <button
                  className=' rounded-md  -rotate-90 cursor-pointer   relative transition-all duration-300  py-1 px-1 disabled:text-slate-700 disabled'
                  disabled={track.layer === allTracks[allTracks.length - 1].layer}
                  onClick={() => updateTimelineLayer(track.id, track.layer, 'BOTTOM')}
                >
                  <MdOutlineArrowBackIosNew size={10} className='scale-150 bg-teal-400  absolute right-2 ' />
                  <MdOutlineArrowBackIosNew size={10} className='scale-150 absolute right-1 ' />
                </button>
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
