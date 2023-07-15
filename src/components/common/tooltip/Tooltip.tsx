import * as TooltipRadix from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import React from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left';

type Props = {
  children: ReactNode;
  content: string;
  position: TooltipPosition;
  isOpen: boolean;
};

const Tooltip = ({ children, content, position, isOpen }: Props) => {
  return (
    <>
      <TooltipRadix.Provider>
        <TooltipRadix.Root open={isOpen}>
          <TooltipRadix.Trigger className='w-full h-full cursor-move' asChild>
            {children}
          </TooltipRadix.Trigger>
          <TooltipRadix.Portal className=''>
            {position === 'top-right' ? (
              <>
                <TooltipRadix.Content
                  className='-translate-y-6 -translate-x-[2px] text-[6px] text-slate-400'
                  side={'right'}
                >
                  <p className='m-0 mb-2 -ml-3.5 -mt-2 bg-slate-900 px-1.5 py-[2px] rounded-md'>{content}</p>
                  <TooltipRadix.Arrow className='fill-slate-400 -rotate-90 scale-50 translate-x-2' />
                </TooltipRadix.Content>
              </>
            ) : position === 'top-left' ? (
              <>
                <TooltipRadix.Content
                  className='-translate-y-7 translate-x-2 text-[6px] text-slate-400'
                  side={'left'}
                >
                  <p className='m-0 mb-2 -mr-2 bg-slate-900 px-1.5 py-[2px] rounded-md'>{content}</p>
                  <TooltipRadix.Arrow className='fill-slate-400 rotate-90 scale-50 -translate-x-2 -translate-y-1.5' />
                </TooltipRadix.Content>
              </>
            ) : (
              <>
                <TooltipRadix.Content className='text-sm text-slate-200' side={position}>
                  {content}
                  <TooltipRadix.Arrow className='fill-slate-400 -rotate-90 scale-75' />
                </TooltipRadix.Content>
              </>
            )}
          </TooltipRadix.Portal>
        </TooltipRadix.Root>
      </TooltipRadix.Provider>
    </>
  );
};

export { Tooltip };
