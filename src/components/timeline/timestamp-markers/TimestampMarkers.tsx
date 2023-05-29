import { useEditorSore } from '@/store';

type Props = {};

const NUM_OF_MARKERS = 10;

const TimestampMarkers = ({}: Props) => {
  //global state
  const totalFrameDuration = useEditorSore((state) => state.durationInFrames);

  const markerWidth = 15 / NUM_OF_MARKERS;
  const frameInterval = Math.ceil(totalFrameDuration / NUM_OF_MARKERS); // Interval between frame stamps

  const getMarkerPosition = (idx: number) => {
    return (totalFrameDuration / NUM_OF_MARKERS) * idx; // Calculate the position based on the duration and marker index
  };

  const formatTimestamp = (timestamp: number) => {
    if (totalFrameDuration < 150) {
      return `${timestamp}ms`; // Display timestamp in milliseconds if it's less than 1 second
    } else if (totalFrameDuration < 3600) {
      return `${(timestamp / 1000).toFixed(1)}s`; // Display timestamp in seconds with one decimal place
    } else {
      const minutes = Math.floor(timestamp / 60000);
      const seconds = Math.floor((timestamp % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Display timestamp in minutes:seconds format
    }
  };

  return (
    <>
      <div className='flex justify-between items-center px-4 w-full'>
        {Array.from({ length: NUM_OF_MARKERS }).map((_, index) => {
          const frameStamp = index % frameInterval === 0; // Check if it's a frame stamp

          return (
            <div key={index} className='relative h-full' style={{ width: `${markerWidth}%` }}>
              {/* Render the marker */}
              {frameStamp ? (
                <div className='w-px bg-white absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-2' />
              ) : (
                <div className='w-full h-px bg-gray-400 absolute bottom-0' />
              )}
              {!frameStamp && (
                <span className='absolute -bottom-4 text-xs text-gray-500'>
                  {formatTimestamp((totalFrameDuration / NUM_OF_MARKERS) * index)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TimestampMarkers;
