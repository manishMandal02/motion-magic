import { MutableRefObject, RefObject, useEffect, useState } from 'react';

type UseContainerSizeProps = {
  containerRef: RefObject<HTMLDivElement>;
  getScrollableSize?: boolean;
};

export const useContainerSize = ({ containerRef, getScrollableSize }: UseContainerSizeProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getDimensions = () => {
      if (getScrollableSize) {
        return {
          width: containerRef.current!.scrollWidth,
          height: containerRef.current!.scrollHeight,
        };
      } else {
        return {
          width: containerRef.current!.offsetWidth,
          height: containerRef.current!.offsetHeight,
        };
      }
    };

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (containerRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef]);

  return dimensions;
};
