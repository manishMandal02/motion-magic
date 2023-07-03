import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';
import { TooltipRef } from '@/components/common/element-wrapper/timeline-element/TimelineElementWrapper';
import { IElementFrameDuration } from '@/types/elements.type';
import { ReferenceLine, TimelineTrack, TrackElement } from '@/types/timeline.type';
import { ResizeBound, getElResizeBounds } from '@/utils/timeline/getElResizeBounds';
import { GetOverlappingElementsProps, getOverlappingElements } from '@/utils/timeline/getOverlappingElements';
import { getOverlappingFrames } from '@/utils/timeline/getOverlappingFrames';
import { nanoid } from 'nanoid';
import { memo, useMemo, useRef, useState } from 'react';

// track spacing top & bottom
const TRACK_PADDING_SPACING = 6;

// initial data for tooltip ref object
const tooltipRefInitialData: TooltipRef = {
  elementId: '',
  startFrame: 0,
  endFrame: 0,
};

type CurrentDragElement = {
  id: string;
  startFrame: number;
  endFrame: number;
  currentTrack: number;
  width: number;
};

// resize handle props
type HandleResizeProps = {
  id: string;
  deltaWidth: number;
  startFrame: number;
  endFrame: number;
  direction: 'left' | 'right';
  layer: number;
  resizeBounds: ResizeBound;
};

// drag end handle props
type HandleOnDragProps = {
  id: string;
  deltaX: number;
  posY: number;
  startFrame: number;
  endFrame: number;
  layer: number;
  width: number;
  elements: TrackElement[];
};
// dragend handle props
type HandleDragEndProps = {
  id: string;
  deltaX: number;
  deltaY: number;
  startFrame: number;
  endFrame: number;
  layer: number;
};

type Props = {
  tracks: TimelineTrack[];
  trackWidth: number;
  trackHeight: number;
  frameWidth: number;
  updateElFrameDuration: (id: string, duration: IElementFrameDuration, newLayer?: number) => void;
};

const TracksWrapper = memo(
  ({ tracks, frameWidth, trackHeight, trackWidth, updateElFrameDuration }: Props) => {
    // local state
    // store position of elements dragging
    const [currentDragEl, setCurrentDragEl] = useState<CurrentDragElement>({
      id: '',
      startFrame: 0,
      endFrame: 0,
      currentTrack: 0,
      width: 0,
    });

    console.log('🚀 ~ file: TracksWrapper.tsx:81 ~ currentDragEl:', currentDragEl);

    //  new track
    const [createNewTrack, setCreateNewTrack] = useState({
      newTrackNum: 0,
    });

    // array of frames to show reference lines
    const [showRefLines, setShowRefLines] = useState<ReferenceLine[] | []>([]);
    // tooltip
    const showTooltipRef = useRef<{ elementId: string; startFrame: number; endFrame: number }>(
      tooltipRefInitialData
    );

    // copy of tracks state for updating elements position while dragging
    let tracksClone = useMemo(() => [...tracks], [tracks]);

    // handle overlapping elements while dragging
    const handleOverlappingEl = ({
      elementId,
      elements,
      startFrame,
      endFrame,
      currentTrack,
    }: GetOverlappingElementsProps & { currentTrack: number }) => {
      if (elements.length <= 1) return;
      const overlappingElements = getOverlappingElements({ elementId, elements, endFrame, startFrame });

      const trackToUpdate = tracksClone.find(track => track.layer === currentTrack);
      if (!trackToUpdate) return;

      // update frame duration of overlapping elements
      for (let i = 0; i < overlappingElements.length; i++) {
        const { id, newStartFrame, newEndFrame } = overlappingElements[i];
        // updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame });
        for (let el of trackToUpdate.elements) {
          if (el.id === id) {
            el.startFrame = newStartFrame;
            el.endFrame = newEndFrame;
          }
        }
      }
      tracksClone[trackToUpdate.layer - 1] = trackToUpdate;
    };

    const resetDragElPos = () => {
      setCurrentDragEl({
        id: '',
        startFrame: 0,
        endFrame: 0,
        currentTrack: 0,
        width: 0,
      });
    };

    //TODO: refactor these 2 handlers, too many code repeats

    // handle resize track elements
    const handleResize = ({
      id,
      deltaWidth,
      startFrame,
      endFrame,
      direction,
      layer,
      resizeBounds,
    }: HandleResizeProps) => {
      console.log('🚀 ~ file: TimelineTracks.tsx:108 ~ TimelineTracks ~ resizeBounds:', resizeBounds);

      // frames to show reference lines
      if (direction === 'left') {
        const newStartFrame = Math.max(0, startFrame - Math.round(deltaWidth / frameWidth));
        // check if within  resize bounds
        if (newStartFrame > resizeBounds.startFrame) {
          updateElFrameDuration(id, {
            startFrame: newStartFrame,
            endFrame,
          });
        } else {
          // update start frame to it's to bound limits
          updateElFrameDuration(id, {
            startFrame: resizeBounds.startFrame,
            endFrame,
          });
        }

        // show tooltip for new start frame
        showTooltipRef.current.elementId = id;
        showTooltipRef.current.startFrame = newStartFrame;
        showTooltipRef.current.endFrame = 0;

        // checking if other elements have same start frame
        const overlappingFrames = getOverlappingFrames(tracks, id, layer, startFrame);

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
              overlappingFrames.reduce((acc: ReferenceLine, curr: ReferenceLine) => {
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
            setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: tracks.length + 1 }]);
          }
        } else {
          setShowRefLines([]);
        }
      }
      if (direction === 'right') {
        const newEndFrame = Math.max(startFrame, endFrame + Math.round(deltaWidth / frameWidth));
        // check if within  resize bounds
        if (newEndFrame < resizeBounds.endFrame) {
          updateElFrameDuration(id, {
            endFrame: newEndFrame,
            startFrame,
          });
        } else {
          // update end frame to it's to bound limits
          updateElFrameDuration(id, {
            endFrame: resizeBounds.endFrame,
            startFrame,
          });
        }

        // show tooltip for new end frame
        showTooltipRef.current.elementId = id;
        showTooltipRef.current.endFrame = newEndFrame;
        showTooltipRef.current.startFrame = 0;

        // checking if other elements have same end frame
        const overlappingFrames = getOverlappingFrames(tracks, id, layer, undefined, endFrame);

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
              overlappingFrames.reduce((acc: ReferenceLine, curr: ReferenceLine) => {
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
            setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: tracks.length + 1 }]);
          }
        } else {
          setShowRefLines([]);
        }
      }
    };

    // handle drag end elements
    const handleDragEnd = ({ id, deltaX, deltaY, startFrame, endFrame, layer }: HandleDragEndProps) => {};

    // handle on drag elements
    const handleOnDrag = ({
      id,
      elements,
      width,
      deltaX,
      posY,
      startFrame,
      endFrame,
      layer,
    }: HandleOnDragProps) => {
      // reset the tracks clone state to reset the position of elements that were moved while dragging
      const elementHeight = trackHeight - TRACK_PADDING_SPACING;

      // calculate new start frame
      const newStartFrame = Math.max(0, startFrame + Math.round(deltaX / frameWidth));
      // calculate end frame
      const newEndFrame = newStartFrame + (endFrame - startFrame);

      // update element position while dragging

      const trackToUpdate = tracksClone.find(track => track.layer === layer);
      if (!trackToUpdate) return;

      for (let el of trackToUpdate.elements) {
        if (el.id === id) {
          el.startFrame = newStartFrame;
          el.endFrame = newEndFrame;
        }
      }
      tracksClone[trackToUpdate.layer - 1] = trackToUpdate;

      // calculate current track
      //   const currentTackOfEl = Math.floor(posY / elementHeight) + (layer - 1);
      const currentTackOfEl =
        posY <= elementHeight / 2 && posY >= elementHeight / 2 + 4
          ? layer
          : posY >= elementHeight / 2 && posY <= elementHeight / 2 - 4
          ? layer + 1
          : layer - 1;

      setCurrentDragEl({
        id,
        currentTrack: currentTackOfEl,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
        width,
      });

      // check if layer has changed
      //   if (deltaY >= trackHeight - TRACK_PADDING_SPACING) {
      //     updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame }, layer + 1);
      //   } else if (deltaY <= TRACK_PADDING_SPACING - trackHeight) {
      //     updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame }, layer - 1);
      //   } else {
      //     updateElFrameDuration(id, { startFrame: newStartFrame, endFrame: newEndFrame });
      //   }

      // check if el is hovering on a track or in between (to create a new track)
      if (posY >= elementHeight / 2 - 4 && posY <= elementHeight / 2 + 4) {
        // reset drag el position
        resetDragElPos();
        const newTrackNum = Math.ceil(posY / trackHeight) + 1;
        // create new Track with this el in it
        setCreateNewTrack({ newTrackNum });
      }

      // show tooltip
      if (layer === layer) {
        showTooltipRef.current.elementId = id;
        showTooltipRef.current.startFrame = newStartFrame;
        showTooltipRef.current.endFrame = newEndFrame;
      } else {
        showTooltipRef.current = tooltipRefInitialData;
      }

      // check if the dragging el is overlapping any other elements

      handleOverlappingEl({
        elementId: id,
        elements: elements,
        endFrame: newEndFrame,
        startFrame: newStartFrame,
        currentTrack: currentTackOfEl,
      });

      const overlappingFrames = getOverlappingFrames(
        tracksClone,
        id,
        currentTackOfEl,
        newStartFrame,
        newEndFrame
      );

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
            ...overlappingFrames.reduce((acc: ReferenceLine[], curr: ReferenceLine) => {
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
          setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: tracks.length + 1 }]);
        }
      } else {
        setShowRefLines([]);
      }

      //
      //if yes, adjust the frames accordingly
      // store the new start & end frames while it's being dragged to show a reference placeholder
    };

    // renders all el on timeline tracks based on their layer levels
    const renderElements = () => {
      return tracksClone.map(track => {
        return (
          <div
            key={track.layer}
            className={` shadow-sm  shadow-brand-darkSecondary  relative flex 
                ${track.isHidden && 'opacity-60'}
                ${track.isLocked && 'opacity-60'}
               `}
            style={{
              width: trackWidth + 'px',
              height: trackHeight,
              // checkered background
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
              // resize bounds
              const resizeBounds = getElResizeBounds({ elements: track.elements, startFrame, endFrame });
              return (
                <TimelineElementWrapper
                  frameWidth={frameWidth}
                  updateElFrameDuration={updateElFrameDuration}
                  width={width}
                  translateX={translateX}
                  height={trackHeight - TRACK_PADDING_SPACING}
                  key={element.id}
                  onDrag={(deltaX, posY) => {
                    handleOnDrag({
                      id,
                      elements: track.elements,
                      width,
                      posY: posY,
                      deltaX,
                      startFrame,
                      endFrame,
                      layer: track.layer,
                    });
                    if (track.layer !== track.layer) {
                    }
                  }}
                  onDragStop={(deltaX, deltaY) => {
                    handleDragEnd({ id, deltaX, deltaY, startFrame, endFrame, layer: track.layer });
                    resetDragElPos();
                  }}
                  handleResize={(deltaWidth, direction) =>
                    handleResize({
                      id,
                      deltaWidth,
                      direction,
                      startFrame,
                      endFrame,
                      layer: track.layer,
                      resizeBounds,
                    })
                  }
                  resetRefLines={() => {
                    setShowRefLines([]);
                    showTooltipRef.current = tooltipRefInitialData;
                  }}
                  showTooltipRef={showTooltipRef}
                  isLocked={track.isLocked || track.isHidden}
                >
                  <div
                    key={element.id}
                    className={`rounded-sm h-full w-[${width}px] flex text-xs font-medium items-center  justify-center overflow-hidden
                       ${element.type === 'TEXT' ? 'bg-teal-500' : 'bg-cyan-500'}
                     ${track.isHidden || track.isLocked ? 'cursor-default' : 'cursor-move'}
                       `}
                  >
                    {element.type}
                  </div>
                </TimelineElementWrapper>
              );
            })}
          </div>
        );
      });
    };

    return (
      <>
        {renderElements()}

        {/* current dragging elements placeholder  */}
        {currentDragEl.id ? (
          <>
            <div
              className='bg-brand-primary bg-opacity-50 rounded-md border-2 border-dashed border-slate-100 absolute top-0 left-0'
              style={{
                width: currentDragEl.width,
                height: trackHeight - TRACK_PADDING_SPACING,
                left: currentDragEl.startFrame * frameWidth + 'px',
                top: currentDragEl.currentTrack * trackHeight + 'px',
              }}
            ></div>
          </>
        ) : null}

        {showRefLines.length > 0
          ? showRefLines.map(line => {
              // minus 20 so that they don't touch the border of the other tracks
              const linePosY = (line.startTrack - 1) * trackHeight + 35;

              // minus 26 so that they don't touch the border of the other tracks
              const lineHeight = (line.endTrack + 1 - line.startTrack) * trackHeight - 16;

              return (
                <hr
                  className={`w-[2px]  h-[${lineHeight}px] rounded-sm absolute top-0 z-[60] bg-transparent CC_dashedBorder_Ref_Lines`}
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
  }
);

export { TracksWrapper };
