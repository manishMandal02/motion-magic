import { MutableRefObject, RefObject, useEffect, useState } from 'react';

type Props = {
  containerRef: RefObject<HTMLDivElement>;
};

export const useContainerSize = ({ containerRef }: Props) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getDimensions = () => ({
      width: containerRef.current!.offsetWidth,
      height: containerRef.current!.offsetHeight,
    });

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
