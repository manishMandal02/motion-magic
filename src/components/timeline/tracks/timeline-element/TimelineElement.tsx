type Props = {
  id: string;
  type: string;
  isTrackLocked: boolean;
};

const TimelineElement = ({ id, type, isTrackLocked }: Props) => {
  return (
    <div
      key={id}
      className={`rounded-sm h-full  w-full flex text-xs font-medium items-center  justify-center overflow-hidden
        ${type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
        ${isTrackLocked ? 'cursor-default' : 'cursor-move'}
        `}
    >
      {type}
    </div>
  );
};

export default TimelineElement;
