import { ReactNode, useState } from 'react';
import { Rnd } from 'react-rnd';
import ResizablePoints from '../art-board-element/ResizablePoints';

type Props = {
  id: string;
  children: ReactNode;
  startFrame: number;
  endFrame: number;
  totalFrameWidth: number;
};

const TimelineElementWrapper = ({ id, children, startFrame, endFrame, totalFrameWidth }: Props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const width = (endFrame - startFrame) * totalFrameWidth;
  const left = startFrame * totalFrameWidth;
  return (
    <>
      <Rnd
        position={{ x: position.x, y: position.y }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
          // TODO: update el startFrame * endFrame, also check for track changes
        }}
        // onResizeStop={(e, direction, ref, delta, position) => {
        //   setSize({
        //     // TODO: update el startFrame * endFrame
        //     width: Number(ref.style.width),
        //     height: Number(ref.style.height),
        //   });
        //   setPosition({
        //     x: position.x,
        //     y: position.y,
        //   });
        // }}
        dragGrid={[1, 32]}
        // scale={videoScale}
        className={` hover:shadow-sm hover:shadow-slate-600`}
        style={{
          left,
          width,
        }}
        // resizeHandleComponent={{
        //   topRight: <ResizablePoints pos='topRight' />,
        //   topLeft: <ResizablePoints pos='topLeft' />,
        //   bottomLeft: <ResizablePoints pos='bottomRight' />,
        //   bottomRight: <ResizablePoints pos='bottomLeft' />,
        // }}
        bounds={'parent'}
        enableResizing={{
          top: false,
          topLeft: false,
          topRight: false,
          right: true,
          left: true,
          bottom: false,
          bottomLeft: false,
          bottomRight: false,
        }}
        dr
      >
        {children}
      </Rnd>
    </>
  );
};

export default TimelineElementWrapper;
