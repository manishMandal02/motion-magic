import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';
import { useEditorSore } from '@/store';
import TimelineLayer from '../layer';

type Props = {
  timelineWidth: number;
  trackHeight: number;
};

const TimelineTracks = ({ timelineWidth, trackHeight }: Props) => {
  const allElements = useEditorSore((state) => state.elements);

  const updateElFrameDuration = useEditorSore((state) => state.updateElFrameDuration);
  const currentFrame = useEditorSore((state) => state.currentFrame);

  const totalFrameDuration = useEditorSore((state) => state.durationInFrames);

  const currentPlaybackPosition = (currentFrame / totalFrameDuration) * 100; // in percentage

  const singleFrameWidth = timelineWidth / totalFrameDuration;

  // renders all el on timeline tracks based on their layer levels
  const renderElements = () => {
    return allElements.map((element) => {
      // width of el based on their start & end time
      const width = (element.timeFrame.endFrame - element.timeFrame.startFrame) * singleFrameWidth;
      // position of el from left to position them based on their start time
      const translateX = element.timeFrame.startFrame * singleFrameWidth;
      // to set them on their respective tracks, so all el don't end up on same track
      // const positionY = TIMELINE_TRACK_HEIGHT * element.layer;
      return (
        <div
          key={element.id}
          className='w-full shadow-sm shadow-slate-700 relative'
          style={{ height: trackHeight }}
        >
          <TimelineElementWrapper
            startFrame={element.timeFrame.startFrame}
            endFrame={element.timeFrame.endFrame}
            id={element.id}
            singleFrameWidth={singleFrameWidth}
            updateElFrameDuration={updateElFrameDuration}
            width={width}
            translateX={translateX}
            height={trackHeight - 10}
          >
            <div
              key={element.id}
              className={`rounded-md h-full  flex text-xs font-medium items-center mb-2 justify-center overflow-hidden
              ${element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
              `}
            >
              {element.type}
            </div>
          </TimelineElementWrapper>
        </div>
      );
    });
  };
  return (
    <>
      <div className=' relative flex flex-col  '>
        <div className=' relative w-full'>{renderElements()}</div>
      </div>
      {/* timeline scrubber */}
      <div
        className='w-px h-full top-0 ml-2 bg-white absolute rounded-lg '
        style={{ left: `${currentPlaybackPosition}%` }}
      ></div>
    </>
  );
};

export default TimelineTracks;
