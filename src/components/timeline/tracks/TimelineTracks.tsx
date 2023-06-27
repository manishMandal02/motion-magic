import { memo, useCallback, useRef, useState } from 'react';
import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';

import { useEditorSore } from '@/store';

import { IElementFrameDuration } from '@/types/elements.type';
import { nanoid } from 'nanoid';
import Tooltip from '@/components/common/tooltip';
import framesToSeconds from '@/utils/common/framesToSeconds';
import { toTwoDigitsNum } from '@/utils/common/formatNumber';

import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragUpdateResponder,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { IReferenceLine } from '@/types/timeline.type';
import getOverlappingEl from '@/utils/timeline/getOverlappingEl';

type HandleResizeProps = {
  id: string;
  deltaWidth: number;
  startFrame: number;
  endFrame: number;
  direction: 'left' | 'right';
  layer: number;
};

type Props = {
  trackHeight: number;
  frameWidth: number;
  timelineWidth: number;
};

const TimelineTracks = ({ frameWidth, trackHeight, timelineWidth }: Props) => {
  // global state
  const allTracks = useEditorSore(state => state.timelineTracks);

  const updateTrackElFrame = useEditorSore(state => state.updateTrackElFrame);

  // local state
  // array of frames to show reference lines
  const [showRefLines, setShowRefLines] = useState<IReferenceLine[] | []>([]);

  const showTooltipRef = useRef<{ elementId: string; startFrame: number; endFrame: number }>({
    elementId: '',
    startFrame: 0,
    endFrame: 0,
  });

  const updateElFrameDuration = (id: string, duration: IElementFrameDuration, newLayer?: number) => {
    if (typeof newLayer !== 'undefined') {
      updateTrackElFrame(id, duration.startFrame, duration.endFrame, newLayer);
    } else {
      updateTrackElFrame(id, duration.startFrame, duration.endFrame);
    }
  };

  // handle resize track elements
  const handleResize = ({ id, deltaWidth, endFrame, startFrame, direction, layer }: HandleResizeProps) => {
    // frames to show reference lines
    if (direction === 'left') {
      const newStartFrame = Math.max(0, startFrame - Math.round(deltaWidth / frameWidth));

      updateElFrameDuration(id, {
        startFrame: newStartFrame,
        endFrame,
      });

      // show tooltip for new start frame
      showTooltipRef.current.elementId = id;
      showTooltipRef.current.startFrame = newStartFrame;
      showTooltipRef.current.endFrame = 0;

      // checking if other elements have same start frame
      const overlappingFrames = getOverlappingEl(allTracks, id, layer, startFrame);

      // get current frame
      const seekerEl = document.getElementById('timeline-seeker');
      if (!seekerEl) return;
      const currentFrame = Number(seekerEl.getAttribute('data-current-frame')) || 0;

      // check if it's current frame (seeker)
      const isOverlappingWithSeeker = newStartFrame === currentFrame;

      const isOverlapping = overlappingFrames.length > 0;
      if (isOverlapping || isOverlappingWithSeeker) {
        if (isOverlapping) {
          setShowRefLines([
            overlappingFrames.reduce((acc, curr) => {
              if (acc.frame === curr.frame) {
                return {
                  ...acc,
                  startTrack: acc.startTrack < curr.startTrack ? acc.startTrack : curr.startTrack,
                  endTrack: acc.endTrack > curr.endTrack ? acc.endTrack : curr.endTrack,
                };
              }
              return acc;
            }),
          ]);
        }
        if (isOverlappingWithSeeker) {
          setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: allTracks.length + 1 }]);
        }
      } else {
        setShowRefLines([]);
      }
    }
    if (direction === 'right') {
      const newEndFrame = Math.max(startFrame, endFrame + Math.round(deltaWidth / frameWidth));

      updateElFrameDuration(id, {
        endFrame: newEndFrame,
        startFrame,
      });

      // show tooltip for new end frame
      showTooltipRef.current.elementId = id;
      showTooltipRef.current.endFrame = newEndFrame;
      showTooltipRef.current.startFrame = 0;

      // checking if other elements have same end frame
      const overlappingFrames = getOverlappingEl(allTracks, id, layer, undefined, endFrame);

      // get current frame
      const seekerEl = document.getElementById('timeline-seeker');
      if (!seekerEl) return;
      const currentFrame = Number(seekerEl.getAttribute('data-current-frame')) || 0;

      // check if it's current frame (seeker)
      const isOverlappingWithSeeker = newEndFrame === currentFrame;

      const isOverlapping = overlappingFrames.length > 0;
      if (isOverlapping || isOverlappingWithSeeker) {
        if (isOverlapping) {
          setShowRefLines([
            overlappingFrames.reduce((acc, curr) => {
              if (acc.frame === curr.frame) {
                return {
                  ...acc,
                  startTrack: acc.startTrack < curr.startTrack ? acc.startTrack : curr.startTrack,
                  endTrack: acc.endTrack > curr.endTrack ? acc.endTrack : curr.endTrack,
                };
              }
              return curr;
            }),
          ]);
        }
        if (isOverlappingWithSeeker) {
          setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: allTracks.length + 1 }]);
        }
      } else {
        setShowRefLines([]);
      }
    }
  };

  // handle drag elements
  const handleDrag = (
    id: string,
    deltaX: number,
    deltaY: number,
    startFrame: number,
    endFrame: number,
    layer: number
  ) => {
    console.log('🚀 ~ file: TimelineTracks.tsx:166 ~ TimelineTracks ~ deltaY:', deltaY);

    // frames to show reference lines
    const newStartFrame = Math.max(0, startFrame + Math.round(deltaX / frameWidth));

    const newEndFrame = newStartFrame + (endFrame - startFrame);

    // check if layer has changed
    const currentLayer = layer;

    if (deltaY >= 46) {
      updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame }, layer + 1);
    } else {
      updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame });
    }

    // show tooltip for new start & end frame
    showTooltipRef.current.elementId = id;
    showTooltipRef.current.startFrame = newStartFrame;
    showTooltipRef.current.endFrame = newEndFrame;

    // checking if other elements have same end frame
    const overlappingFrames = getOverlappingEl(allTracks, id, layer, startFrame, endFrame);

    // get current frame
    const seekerEl = document.getElementById('timeline-seeker');
    if (!seekerEl) return;
    const currentFrame = Number(seekerEl.getAttribute('data-current-frame')) || 0;

    // check if it's current frame (seeker)
    const isOverlappingWithSeeker = newStartFrame === currentFrame || newEndFrame === currentFrame;

    const isOverlapping = overlappingFrames.length > 0;

    if (isOverlapping || isOverlappingWithSeeker) {
      if (isOverlapping) {
        setShowRefLines([
          ...overlappingFrames.reduce((acc: IReferenceLine[], curr) => {
            const existingFrame = acc.find(obj => obj.frame === curr.frame);

            if (existingFrame) {
              existingFrame.startTrack = Math.min(existingFrame.startTrack, curr.startTrack);
              existingFrame.endTrack = Math.max(existingFrame.endTrack, curr.endTrack);
            } else {
              acc.push(curr);
            }

            return acc;
          }, []),
        ]);
      }
      if (isOverlappingWithSeeker) {
        setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: allTracks.length + 1 }]);
      }
    } else {
      setShowRefLines([]);
    }
  };

  // renders all el on timeline tracks based on their layer levels
  const renderElements = () => {
    return allTracks.map(track => {
      return (
        <div
          key={track.layer}
          className={` shadow-sm  shadow-brand-darkSecondary  relative flex 
                ${track.isHidden && 'opacity-60'}
                ${track.isLocked && 'opacity-60'}
               `}
          style={{
            width: timelineWidth + 'px',
            height: trackHeight,
            // checkered bg
            ...(track.isHidden
              ? {
                  backgroundImage: `repeating-linear-gradient(-45deg, #2e3b4e, #353f4f 4px, #334156 1px, #2f3c4e 15px)`,
                  backgroundSize: '100%',
                  backgroundPosition: 'center',
                }
              : {}),
          }}
        >
          {track.elements.map(element => {
            const { startFrame, endFrame, id } = element;
            // width of el based on their start & end time
            const width = (endFrame - startFrame) * frameWidth;
            // position of el from left to position them based on their start time
            const translateX = startFrame * frameWidth;

            return (
              <TimelineElementWrapper
                frameWidth={frameWidth}
                updateElFrameDuration={updateElFrameDuration}
                width={width}
                translateX={translateX}
                height={trackHeight - 4}
                key={element.id}
                handleDrag={(deltaX, deltaY) =>
                  handleDrag(id, deltaX, deltaY, startFrame, endFrame, track.layer)
                }
                handleResize={(deltaWidth, direction) =>
                  handleResize({
                    id,
                    deltaWidth,
                    direction,
                    startFrame,
                    endFrame,
                    layer: track.layer,
                  })
                }
                resetRefLines={() => {
                  setShowRefLines([]);
                  showTooltipRef.current = { elementId: '', startFrame: 0, endFrame: 0 };
                }}
                isLocked={track.isLocked || track.isHidden}
              >
                <Tooltip
                  content={toTwoDigitsNum(framesToSeconds(showTooltipRef.current.startFrame, 1)).toString()}
                  position={'top-left'}
                  isOpen={showTooltipRef.current.elementId === id && !!showTooltipRef.current.startFrame}
                >
                  <Tooltip
                    content={toTwoDigitsNum(framesToSeconds(showTooltipRef.current.endFrame, 1)).toString()}
                    position={'top-right'}
                    isOpen={showTooltipRef.current.elementId === id && !!showTooltipRef.current.endFrame}
                  >
                    <div
                      key={element.id}
                      className={`rounded-md h-full w-[${width}px] flex text-xs font-medium items-center  mb-2 justify-center overflow-hidden
                       ${element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
                     ${track.isHidden || track.isLocked ? 'cursor-default' : 'cursor-move'}
                       `}
                    >
                      {element.type}
                    </div>
                  </Tooltip>
                </Tooltip>
              </TimelineElementWrapper>
            );
          })}
        </div>
      );
    });
  };

  return (
    <>
      <div
        className='relative min-w-full h-full bg-brand-darkPrimary tracksContainer'
        style={{
          height: trackHeight * allTracks.length,
          width: timelineWidth + 'px',
        }}
      >
        {/* <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}> */}
        {renderElements()}
        {/* </DragDropContext> */}
      </div>

      {showRefLines.length > 0
        ? showRefLines.map(line => {
            // minus 20 so that they don't touch the border of the other tracks
            const linePosY = (line.startTrack - 1) * trackHeight + 40;

            // minus 26 so that they don't touch the border of the other tracks
            const lineHeight = (line.endTrack + 1 - line.startTrack) * trackHeight - 26;

            return (
              <hr
                className={`w-[2px]  h-[${lineHeight}px] rounded-sm absolute top-0 z-[60] bg-transparent CC_dashedBorder_Ref_Lines`}
                // className={`w-[1.5px]  h-[${lineHeight}] rounded-sm absolute top-0 z-[60] bg-transparent CC_dashedBorder_Ref_Lines`}
                key={nanoid()}
                style={{
                  transform: ` translate(${line.frame * frameWidth}px, ${linePosY}px)`,
                  height: lineHeight + 'px',
                }}
              />
            );
          })
        : null}
    </>
  );
};

export default memo(TimelineTracks);
