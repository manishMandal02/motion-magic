import ElementWrapper from '@/components/common/element-wrapper';
import {
  IElementPosition,
  IElementSize,
  IUpdateElPosition,
  IUpdateElSize,
} from '@/types/editor/elements.type';
import React from 'react';

type Props = {
  id: string;
  size: IElementSize;
  position: IElementPosition;
  setSize: IUpdateElSize;
  setPosition: IUpdateElPosition;
};

const Rectangle = ({ size, position, setPosition, setSize, id }: Props) => {
  return (
    <>
      <ElementWrapper id={id} position={position} size={size} setPosition={setPosition} setSize={setSize}>
        <div className='w-full z-20 h-full bg-sky-400 rounded-lg  flex items-center justify-center'></div>
      </ElementWrapper>
    </>
  );
};

export default Rectangle;
