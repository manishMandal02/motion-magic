import { RenderTimestampProps } from '@/components/timeline/timeline-ruler/marker/RenderTimestamp';
import { FC } from 'react';

import { FixedSizeList, ListChildComponentProps, VariableSizeList } from 'react-window';

type Props = {
  markerWidth: number;
  totalMarkers: number;
  frameWidth: number;
  width: number;
  isScaleFitToTimeline: boolean;
  childrenProps: RenderTimestampProps;
  children: FC<ListChildComponentProps<RenderTimestampProps>>;
};

const VirtualizedList = ({
  frameWidth,
  markerWidth,
  totalMarkers,
  isScaleFitToTimeline,
  width,
  children,
  childrenProps,
}: Props) => {
  // to force render  react-window
  const key = markerWidth + totalMarkers;

  if (isScaleFitToTimeline) {
    return (
      <>
        <VariableSizeList
          height={25}
          key={key}
          itemCount={totalMarkers}
          itemSize={(index: number) => {
            if (index === 0) {
              return markerWidth + frameWidth;
            } else {
              return markerWidth;
            }
          }}
          layout='horizontal'
          width={width}
          itemData={childrenProps}
        >
          {children}
        </VariableSizeList>
      </>
    );
  } else {
    return (
      <FixedSizeList
        height={25}
        key={key}
        itemCount={totalMarkers}
        itemSize={markerWidth}
        layout='horizontal'
        width={width}
        itemData={childrenProps}
      >
        {children}
      </FixedSizeList>
    );
  }
};

export default VirtualizedList;
