import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';
import { useEditorSore } from '@/store';

type Props = {
  timelineWidth: number;
};

const TimelineTracks = ({ timelineWidth }: Props) => {
  const allElements = useEditorSore((state) => state.elements);

  const updateElFrameDuration = useEditorSore((state) => state.updateElFrameDuration);
  const currentFrame = useEditorSore((state) => state.currentFrame);

  const totalFrameDuration = useEditorSore((state) => state.durationInFrames);

  const currentPlaybackPosition = (currentFrame / totalFrameDuration) * 100; // in percentage

  const singleFrameWidth = timelineWidth / totalFrameDuration;

  const renderElements = () => {
    return allElements.map((element) => {
      const width = (element.timeFrame.endFrame - element.timeFrame.startFrame) * singleFrameWidth;

      console.log(
        '🚀 ~ file: TimelineTracks.tsx:24 ~ returnallElements.map ~ startFrame:',
        element.timeFrame.startFrame
      );

      console.log(
        '🚀 ~ file: TimelineTracks.tsx:24 ~ returnallElements.map ~ endFrame:',
        element.timeFrame.endFrame
      );

      const left = element.timeFrame.startFrame * singleFrameWidth;

      console.log('🚀 ~ file: TimelineTracks.tsx:31 ~ returnallElements.map ~ left:', left);

      return (
        <TimelineElementWrapper
          startFrame={element.timeFrame.startFrame}
          endFrame={element.timeFrame.endFrame}
          id={element.id}
          singleFrameWidth={singleFrameWidth}
          key={element.id}
          updateElFrameDuration={updateElFrameDuration}
          width={width}
          left={left}
        >
          <div
            key={element.id}
            className={`rounded-sm h-full  flex text-xs font-medium items-center mb-2 justify-center
              ${element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
              `}
          >
            {element.type}
          </div>
        </TimelineElementWrapper>
      );
    });
  };
  return (
    <>
      <div className='h-full relative'>{renderElements()}</div>
      {/* timeline scrubber */}
      <div
        className='w-px h-full top-0 ml-2 bg-white absolute rounded-lg'
        style={{ left: `${currentPlaybackPosition}%` }}
      ></div>
    </>
  );
};

export default TimelineTracks;
