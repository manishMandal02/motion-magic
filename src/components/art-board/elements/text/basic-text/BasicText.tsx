import ElementWrapper from '@/components/common/element-wrapper';
import type { ITextElement, IUpdateElPosition, IUpdateElSize } from '@/types/editor/elements.type';

type Props = Pick<ITextElement, 'position' | 'size' | 'fontSize' | 'value' | 'id'> & {
  setPosition: IUpdateElPosition;
  setSize: IUpdateElSize;
};

const BasicText = ({ size, position, setPosition, setSize, value, fontSize, id }: Props) => {
  return (
    <ElementWrapper id={id} position={position} size={size} setPosition={setPosition} setSize={setSize}>
      <div className={`bg-slate-300 w-full z-20 h-full`} style={{ fontSize }}>
        {value}
      </div>
    </ElementWrapper>
  );
};

export default BasicText;
