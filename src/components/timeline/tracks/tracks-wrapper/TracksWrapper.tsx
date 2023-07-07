import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';
import { TooltipRef } from '@/components/common/element-wrapper/timeline-element/TimelineElementWrapper';
import { IElementFrameDuration } from '@/types/elements.type';
import { ReferenceLine, TimelineTrack, TrackElement } from '@/types/timeline.type';
import { ResizeBound, getElResizeBounds } from '@/utils/timeline/getElResizeBounds';
import { handleOverlappingElements } from '@/utils/timeline/getOverlappingElements';
import { getOverlappingFrames } from '@/utils/timeline/getOverlappingFrames';
import { nanoid } from 'nanoid';
import { memo, useRef, useState } from 'react';
import _deepClone from 'lodash/cloneDeep';

// track spacing top & bottom
const TRACK_PADDING_SPACING = 6;

// initial data for tooltip ref object
const tooltipRefInitialData: TooltipRef = {
  elementId: '',
  startFrame: 0,
  endFrame: 0,
};

export type CurrentDragElement = {
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
  updateElFrameDuration: (id: string, duration: IElementFrameDuration) => void;
  updateAllTracksWithOnDragEnd: (tracks: TimelineTrack[]) => void;
};

const TracksWrapper = ({
  tracks,
  frameWidth,
  trackHeight,
  trackWidth,
  updateElFrameDuration,
  updateAllTracksWithOnDragEnd,
}: Props) => {
  // local state
  // store position of elements dragging
  const [currentDragEl, setCurrentDragEl] = useState<CurrentDragElement>({
    id: '',
    startFrame: 0,
    endFrame: 0,
    currentTrack: 0,
    width: 0,
  });

  //  new track
  const [createNewTrack, setCreateNewTrack] = useState({
    newTrackNum: 0,
  });

  // array of frames to show reference lines
  const [showRefLines, setShowRefLines] = useState<ReferenceLine[] | []>([]);
  // time stamp tooltip
  const showTooltipRef = useRef<{ elementId: string; startFrame: number; endFrame: number }>(
    tooltipRefInitialData
  );

  // copy of tracks state for updating elements position while dragging
  let tracksClone: TimelineTrack[] = tracks.map(track => ({ ...track }));

  const resetDragElPos = () => {
    setCurrentDragEl({
      id: '',
      startFrame: 0,
      endFrame: 0,
      currentTrack: 0,
      width: 0,
    });
  };

  //TODO: refactor these 2 handlers (resize & drag), too many code repeats

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
      const overlappingFrames = getOverlappingFrames(tracksClone, id, layer, startFrame);

      // get current frame
      const seekerEl = document.getElementById('timeline-seeker');
      if (!seekerEl) return;
      const currentFrame = Number(seekerEl.getAttribute('data-current-frame')) || 0;

      // check if it's current frame (seeker)
      const isOverlappingWithSeeker = newStartFrame === currentFrame;

      const isOverlappingFrames = overlappingFrames.length > 0;
      if (isOverlappingFrames || isOverlappingWithSeeker) {
        if (isOverlappingFrames) {
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
          setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: tracksClone.length + 1 }]);
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
      const overlappingFrames = getOverlappingFrames(tracksClone, id, layer, undefined, endFrame);

      // get current frame
      const seekerEl = document.getElementById('timeline-seeker');
      if (!seekerEl) return;
      const currentFrame = Number(seekerEl.getAttribute('data-current-frame')) || 0;

      // check if it's current frame (seeker)
      const isOverlappingWithSeeker = newEndFrame === currentFrame;

      const isOverlappingFrames = overlappingFrames.length > 0;
      if (isOverlappingFrames || isOverlappingWithSeeker) {
        if (isOverlappingFrames) {
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
          setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: tracksClone.length + 1 }]);
        }
      } else {
        setShowRefLines([]);
      }
    }
  };

  // handle on drag elements
  const handleOnDrag = ({ id, width, deltaX, posY, startFrame, endFrame, layer }: HandleOnDragProps) => {
    // reset the tracks clone state to reset the position of elements that were moved while dragging
    const elementHeight = trackHeight - TRACK_PADDING_SPACING;

    // calculate new start frame
    const newStartFrame = Math.max(0, startFrame + Math.round(deltaX / frameWidth));
    // calculate end frame
    const newEndFrame = newStartFrame + (endFrame - startFrame);

    // update element position while dragging
    const trackToUpdate = tracksClone.find(track => track.layer === layer);
    if (!trackToUpdate) return;

    // get active el state from tracks (all elements)
    const activeEl = trackToUpdate.elements.find(el => el.id === id);
    if (!activeEl) return;

    for (let el of trackToUpdate.elements) {
      if (el.id === id) {
        el.startFrame = newStartFrame;
        el.endFrame = newEndFrame;
      }
    }
    tracksClone[trackToUpdate.layer - 1] = trackToUpdate;

    const currentTrackOfEl =
      posY <= -Math.abs(elementHeight / 2)
        ? layer - Math.round(Math.abs(posY) / elementHeight)
        : posY >= elementHeight / 2
        ? layer + Math.round(posY / elementHeight)
        : layer;

    // check if the dragging el is overlapping any other elements
    const isOverlappingWithOtherElements = handleOverlappingElements({
      elementId: id,
      elements: tracksClone[currentTrackOfEl - 1].elements,
      endFrame: newEndFrame,
      startFrame: newStartFrame,
      currentTrack: currentTrackOfEl,
      setCurrentDragEl: setCurrentDragEl,
    });

    if (!isOverlappingWithOtherElements) {
      setCurrentDragEl({
        id,
        currentTrack: currentTrackOfEl,
        startFrame: newStartFrame,
        endFrame: newEndFrame,
        width,
      });
    }

    // check if el is hovering on a track or in between (to create a new track)
    const posYByHeight = posY / (elementHeight / 2);

    if (Number.isInteger(posYByHeight) && posYByHeight % 2 !== 0) {
      // reset drag el position
      resetDragElPos();

      const newLayerValue = Math.ceil(Math.abs(posY / elementHeight));

      const newTrackNum =
        posY > 0
          ? Math.min(tracksClone.length + 1, layer + newLayerValue)
          : Math.max(1, layer + 1 - newLayerValue);

      // create new Track with this el in it
      setCreateNewTrack({ newTrackNum });
    }

    //TODO: overlapping elements while dragging & showing the place holder accordingly
    //TODO: show new layer line when hovering between layers
    //TODO: revert back if still drag after overlapping of elements occur
    //TODO: Auto scroll on dragging to the extreme end on X & Y axis
    //TODO: add memo() for all major components under timeline directly
    //TODO:

    // show tooltip
    showTooltipRef.current.elementId = id;
    showTooltipRef.current.startFrame = newStartFrame;
    showTooltipRef.current.endFrame = newEndFrame;

    // handleOverlappingEl({
    //   elementId: id,
    //   elements: tracksClone[currentTrackOfEl].elements,
    //   endFrame: newEndFrame,
    //   startFrame: newStartFrame,
    //   currentTrack: currentTrackOfEl,
    // });

    const overlappingFrames = getOverlappingFrames(
      tracksClone,
      id,
      currentTrackOfEl,
      newStartFrame,
      newEndFrame
    );

    // get current frame
    const seekerEl = document.getElementById('timeline-seeker');
    if (!seekerEl) return;
    const currentFrame = Number(seekerEl.getAttribute('data-current-frame')) || 0;

    // check if it's current frame (seeker)
    const isOverlappingWithSeeker = newStartFrame === currentFrame || newEndFrame === currentFrame;

    const isOverlappingFrames = overlappingFrames.length > 0;

    if (isOverlappingFrames || isOverlappingWithSeeker) {
      if (isOverlappingFrames) {
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
        setShowRefLines([{ frame: currentFrame, startTrack: 1, endTrack: tracksClone.length + 1 }]);
      }
    } else {
      setShowRefLines([]);
    }

    //
    //if yes, adjust the frames accordingly
    // store the new start & end frames while it's being dragged to show a reference placeholder
  };

  // handle drag end elements
  const handleDragEnd = ({ id, deltaX, deltaY, startFrame, endFrame, layer }: HandleDragEndProps) => {
    //TODO: check if the if the drag was for create new track (users stopped in between the tracks), if yes then handle it
    //
    //
    //TODO: update the tracks clone state to to main state

    const currentTrackWithEl = tracksClone.find(track => track.layer === layer);
    if (!currentTrackWithEl) return;

    const elementToUpdate = currentTrackWithEl.elements.find(el => el.id === currentDragEl.id);
    if (!elementToUpdate) return;
    // update dragged element time-frame to the placeholder time-frame
    elementToUpdate.startFrame = currentDragEl.startFrame;
    elementToUpdate.endFrame = currentDragEl.endFrame;

    if (currentDragEl.currentTrack !== layer) {
      // add el to new track/layer
      const trackToAddElTo = tracksClone.find(track => track.layer === currentDragEl.currentTrack);
      if (!trackToAddElTo) return;
      trackToAddElTo.elements = [...trackToAddElTo.elements, elementToUpdate];

      // remove the el from track
      currentTrackWithEl.elements = [...currentTrackWithEl.elements.filter(el => el.id !== currentDragEl.id)];

      // delete the track if empty
      if (currentTrackWithEl.elements.length === 0) {
        tracksClone = tracksClone.filter(track => track.id !== currentTrackWithEl.id);
        // giver a layer number to each track
        tracksClone = tracksClone.map((track, idx) => {
          track.layer = idx + 1;
          return track;
        });
      }
    }

    updateAllTracksWithOnDragEnd(tracksClone);
    //
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
                onDragStart={() => {
                  setCurrentDragEl({
                    startFrame,
                    endFrame,
                    id,
                    width,
                    currentTrack: track.layer,
                  });
                }}
                onDrag={(deltaX, posY) => {
                  handleOnDrag({
                    id,
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
              top: (currentDragEl.currentTrack - 1) * trackHeight + 'px',
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
};

export default memo(TracksWrapper);
