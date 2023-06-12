import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

type Props = {
  value: number;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  [x: string]: any;
};

const Slider = ({ value, defaultValue, min, max, step, onValueChange, ...restProps }: Props) => {
  const onValueChangeHandler = (value: number[]) => {
    onValueChange(value[0]);
  };
  return (
    <form>
      <RadixSlider.Root
        className='relative flex items-center select-none touch-none w-full h-5'
        defaultValue={[defaultValue]}
        value={[value]}
        max={max}
        step={step}
        min={min}
        onValueChange={onValueChangeHandler}
        {...restProps}
      >
        <RadixSlider.Track className='bg-slate-950 relative grow rounded-full h-[3px]'>
          <RadixSlider.Range className='absolute bg-white rounded-full h-full' />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className='block w-3 h-3 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-indigo-500 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8'
          aria-label='Volume'
        />
      </RadixSlider.Root>
    </form>
  );
};

export default Slider;
