import { IElement, IElementTypes } from '@/types/editor/elements.type';
import ShapeOptions from './shapes';
import TextOptions from './text';

type Props = {
  selectedEl: IElement;
};

const SelectedElOptions = ({ selectedEl }: Props) => {
  switch (selectedEl.type) {
    case IElementTypes.SHAPE: {
      return <ShapeOptions />;
    }
    default: {
      return <TextOptions />;
    }
  }
};

export default SelectedElOptions;
