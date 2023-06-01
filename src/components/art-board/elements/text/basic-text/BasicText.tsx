import ArtBoardElementWrapper from '@/components/common/element-wrapper/art-board-element';
import type { ITextElement, IUpdateElPosition, IUpdateElSize } from '@/types/elements.type';

type Props = Pick<ITextElement, 'position' | 'size' | 'fontSize' | 'value' | 'id'> & {
  setPosition: IUpdateElPosition;
  setSize: IUpdateElSize;
};

const BasicText = ({ size, position, setPosition, setSize, value, fontSize, id }: Props) => {
  return (
    <ArtBoardElementWrapper
      id={id}
      position={position}
      size={size}
      setPosition={setPosition}
      setSize={setSize}
    >
      <div
        className={`bg-slate-800 text-white w-full z-20 h-full rounded-lg flex items-center justify-center`}
        style={{ fontSize }}
      >
        {value}
      </div>
    </ArtBoardElementWrapper>
  );
};

export default BasicText;
