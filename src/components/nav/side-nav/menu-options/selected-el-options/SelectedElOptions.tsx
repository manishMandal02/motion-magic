import { IElement, IElementType } from '@/types/elements.type';
import ShapeOptions from './shapes';
import TextOptions from './text';

type Props = {
  selectedEl: IElement;
};

const SelectedElOptions = ({ selectedEl }: Props) => {
  switch (selectedEl.type) {
    case IElementType.SHAPE: {
      return <ShapeOptions />;
    }
    default: {
      return <TextOptions />;
    }
  }
};

export default SelectedElOptions;
