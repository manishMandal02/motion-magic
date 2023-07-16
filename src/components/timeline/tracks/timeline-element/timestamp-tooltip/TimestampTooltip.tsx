import { toTwoDigitsNum } from '@/utils/common/formatNumber';
import framesToSeconds from '@/utils/common/framesToSeconds';
import * as TooltipRadix from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import React from 'react';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  startTime: number | null;
  endTime: number | null;
};

const TimestampTooltip = ({ children, isOpen, startTime, endTime }: Props) => {
  return (
    <>
      <TooltipRadix.Provider>
        <TooltipRadix.Root open={isOpen}>
          <TooltipRadix.Trigger className='w-full h-full cursor-move'>{children}</TooltipRadix.Trigger>
          <TooltipRadix.Portal className=''>
            <div>
              {startTime ? (
                <>
                  {/* top-left */}
                  <TooltipRadix.Content className='-translate-y-[2.1rem] translate-x-1.5' side={'left'}>
                    <p className='m-0 mb-2 -mr-2 bg-slate-800  text-[.5rem]  text-slate-300 font-light px-[4.5px] py-[1.5px] rounded-md'>
                      {toTwoDigitsNum(framesToSeconds(startTime, 1))}
                    </p>
                    <TooltipRadix.Arrow className='fill-slate-600 rotate-90 scale-75 -translate-x-2.5 -translate-y-1.5' />
                  </TooltipRadix.Content>
                </>
              ) : (
                <></>
              )}
              {endTime ? (
                <>
                  {/* top-right */}
                  <TooltipRadix.Content
                    className='-translate-y-[2.1rem] -translate-x-[1.05rem]'
                    side={'right'}
                  >
                    <p className='m-0 mb-2 -mr-2 bg-slate-800  text-[.5rem]  text-slate-300 font-light px-[4.5px] py-[1.5px] rounded-md'>
                      {toTwoDigitsNum(framesToSeconds(endTime, 1))}
                    </p>
                    <TooltipRadix.Arrow className='fill-slate-600 -rotate-90 scale-75 translate-x-2.5 -translate-y-4' />
                  </TooltipRadix.Content>
                </>
              ) : (
                <></>
              )}
            </div>
          </TooltipRadix.Portal>
        </TooltipRadix.Root>
      </TooltipRadix.Provider>
    </>
  );
};

export { TimestampTooltip };
