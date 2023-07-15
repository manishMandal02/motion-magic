import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element';
import { TooltipRef } from '@/components/common/element-wrapper/timeline-element/TimelineElementWrapper';
import { IElementFrameDuration } from '@/types/elements.type';
import { ReferenceLine, TimelineTrack, ITrackElement } from '@/types/timeline.type';
import { ResizeBound, getElResizeBounds } from '@/utils/timeline/getElResizeBounds';
import { handleOverlappingElements } from '@/utils/timeline/getOverlappingElements';
import { getOverlappingFrames } from '@/utils/timeline/getOverlappingFrames';
import { nanoid } from 'nanoid';
import { MouseEvent, memo, useEffect, useRef, useState } from 'react';
import _deepClone from 'lodash/cloneDeep';
import { produce } from 'immer';
import { useEditorStore } from '@/store';

import { DraggableData } from 'react-rnd';
import TrackElement from '../track-element';
// import TrackElement from '../track-element';

// track spacing top & bottom
const TRACK_PADDING_SPACING = 6;

// initial data for tooltip ref object
const tooltipRefInitialData: TooltipRef = {
  elementId: '',
  startFrame: 0,
  endFrame: 0,
};

export type CreateTrackOnDragParams = {
  trackNum: number;
  element: Omit<ITrackElement, 'type'>;
  elPrevTrack: number;
};

export type CurrentDragElement = {
  id: string;
  startFrame: number;
  endFrame: number;
  currentTrack: number;
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
  layer: number;
};

type Props = {
  tracks: TimelineTrack[];
  trackWidth: number;
  trackHeight: number;
  frameWidth: number;
  timelineVisibleWidth: number;
  updateElFrameDuration: (id: string, duration: IElementFrameDuration) => void;
};

const TracksWrapper = ({
  tracks,
  frameWidth,
  trackHeight,
  trackWidth,
  updateElFrameDuration,
  timelineVisibleWidth,
}: Props) => {
  // global state
  const updateAllTimelineTracks = useEditorStore(state => state.updateAllTimelineTracks);
  const createNewTrackOnDrag = useEditorStore(state => state.createNewTrackOnDrag);

  // local state
  // store position of elements dragging
  const [currentDragEl, setCurrentDragEl] = useState<CurrentDragElement>({
    id: '',
    startFrame: 0,
    endFrame: 0,
    currentTrack: 0,
  });

  //  new track
  const [createNewTrack, setCreateNewTrack] = useState<CreateTrackOnDragParams | undefined>(undefined);
  // array of frames to show reference lines
  const [showRefLines, setShowRefLines] = useState<ReferenceLine[]>([]);
  // time stamp tooltip
  const showTooltipRef = useRef<{ elementId: string; startFrame: number; endFrame: number }>(
    tooltipRefInitialData
  );

  const [tracksClone, setTracksClone] = useState([...tracks]);

  useEffect(() => {
    setTracksClone([...tracks]);
  }, [tracks]);

  // scroll ref to handle requestAnimationFrame to scroll when elements are dragged to the edge of the container
  const scrollAnimationFrameRef = useRef<number | null>(null);
  const AUTO_SCROLL_SPEED = 5;

  const stopAutoScroll = () => {
    cancelAnimationFrame(scrollAnimationFrameRef.current!);
    scrollAnimationFrameRef.current = null;
  };

  // to scroll container
  const scrollContainer = (
    container: HTMLDivElement,
    scrollDirection: 'top' | 'bottom' | 'left' | 'right',
    scrollAmount = AUTO_SCROLL_SPEED
  ) => {
    console.log('🚀 ~ file: TracksWrapper.tsx:120 ~ scrollDirection:', scrollDirection);
    if (scrollAnimationFrameRef === null) return;
    if (scrollDirection === 'top') {
      if (container.scrollTop <= 0) {
        stopAutoScroll();
      }

      container.scrollBy(0, -scrollAmount);
      scrollAnimationFrameRef.current = requestAnimationFrame(() =>
        scrollContainer(container, scrollDirection, scrollAmount)
      );
      return;
    }
    if (scrollDirection === 'bottom') {
      container.scrollBy(0, scrollAmount);

      if (Math.ceil(container.scrollTop) >= container.scrollHeight - container.clientHeight) {
        stopAutoScroll();
      }
      scrollAnimationFrameRef.current = requestAnimationFrame(() =>
        scrollContainer(container, scrollDirection, scrollAmount)
      );
      return;
    }
    if (scrollDirection === 'left') {
      if (container.scrollLeft <= 0) return;

      container.scrollBy(-scrollAmount, 0);
      scrollAnimationFrameRef.current = requestAnimationFrame(() =>
        scrollContainer(container, scrollDirection, scrollAmount)
      );
      return;
    }
    if (scrollDirection === 'right') {
      container.scrollBy(scrollAmount, 0);
      scrollAnimationFrameRef.current = requestAnimationFrame(() =>
        scrollContainer(container, scrollDirection, scrollAmount)
      );
      return;
    }
  };

  // timeline-tracks-wrapper

  const resetDragElPos = () => {
    setCurrentDragEl({
      id: '',
      startFrame: 0,
      endFrame: 0,
      currentTrack: 0,
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
    setTracksClone(prevTracks =>
      produce(prevTracks, (draft: TimelineTrack[]) => {
        const trackToUpdate = draft.find(track => track.layer === layer);
        if (!trackToUpdate) return;

        const activeEl = trackToUpdate.elements.find(el => el.id === id);
        if (!activeEl) return;

        activeEl.startFrame = newStartFrame;
        activeEl.endFrame = newEndFrame;
      })
    );

    // position Y of element relative to parent
    const absolutePosY = trackHeight * layer + posY;

    // calculate current track that the element is being dragged on
    let currentTrackOfEl = Math.max(1, Math.round(absolutePosY / trackHeight));

    // track/layer num cannot be grater than track length
    currentTrackOfEl = Math.min(tracksClone.length, currentTrackOfEl);

    // get all elements of the track that placeholder is currently on
    const allElementsOfCurrTrack =
      tracksClone[currentTrackOfEl - 1] && tracksClone[currentTrackOfEl - 1].elements;

    if (allElementsOfCurrTrack.length > 0) {
      // check if the dragging el is overlapping any other elements
      const isOverlappingWithOtherElements = handleOverlappingElements({
        elementId: id,
        elements: allElementsOfCurrTrack,
        endFrame: newEndFrame,
        startFrame: newStartFrame,
        currentDragEl: currentDragEl,
        setCurrentDragEl: setCurrentDragEl,
      });
      if (!isOverlappingWithOtherElements) {
        setCurrentDragEl({
          id,
          currentTrack: currentTrackOfEl,
          startFrame: newStartFrame,
          endFrame: newEndFrame,
        });
      } else {
        setCurrentDragEl(prev => ({ ...prev, currentTrack: currentTrackOfEl }));
      }
    }

    // check if el is hovering on a track or in between (to create a new track)
    const posYByHeight = posY / (trackHeight / 2);

    if (Number.isInteger(posYByHeight) && posYByHeight % 2 !== 0) {
      // reset drag el position (to hide el placeholder while dragging)
      resetDragElPos();

      // const newLayerValue = Math.ceil(Math.abs(posY / elementHeight));
      const newTrackNum = Math.max(1, Math.round(absolutePosY / trackHeight));

      // create new Track with this el in it
      setCreateNewTrack({
        trackNum: newTrackNum,
        element: {
          id,
          startFrame: newStartFrame,
          endFrame: newEndFrame,
        },
        elPrevTrack: layer,
      });
    } else {
      setCreateNewTrack(undefined);
    }

    // show tooltip
    showTooltipRef.current.elementId = id;
    showTooltipRef.current.startFrame = newStartFrame;
    showTooltipRef.current.endFrame = newEndFrame;

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
  };

  // handle drag end elements
  const handleDragEnd = ({ id, layer }: HandleDragEndProps) => {
    //TODO: check if the if the drag was for create new track (users stopped in between the tracks), if yes then handle it
    if (createNewTrack?.trackNum && !currentDragEl.id) {
      createNewTrackOnDrag(createNewTrack);
      return;
    }

    //TODO: temporary solution for elements flickering after onDrag completed (it goes to it's previous track and then shit back to new track)
    if (layer !== currentDragEl.currentTrack) {
      setTracksClone(prevTracks =>
        produce(prevTracks, (draft: TimelineTrack[]) => {
          const trackToUpdate = draft.find(track => track.layer === layer);
          if (!trackToUpdate) return;

          const activeEl = trackToUpdate.elements.find(el => el.id === id);
          if (!activeEl) return;
          activeEl.startFrame = 0;
          activeEl.endFrame = 0;
        })
      );
    }
    // setTracksClone([...tracks]);
    updateAllTimelineTracks(currentDragEl, layer);
  };

  // handle element dragged to the edge of the container
  const handleDragToEdge = (data: DraggableData, elementWidth: number, e: MouseEvent<HTMLElement>) => {
    // scrollable tracks container
    const tracksContainer = document.getElementById('timeline-tracks-wrapper') as HTMLDivElement | null;
    if (!tracksContainer) return;

    const { x, y } = data;

    // get timeline container
    const timelineRulerContainer = document.getElementById('timeline-ruler-container');
    if (!timelineRulerContainer) return;

    const timelineRulerHeight = timelineRulerContainer.clientHeight;

    const rightBound = tracksContainer.clientWidth;

    // calculate container bound - timelineRuler height as both are child of the same parent container
    const bottomBound = tracksContainer.clientHeight - timelineRulerHeight;

    const adjustedX = x - tracksContainer.scrollLeft;

    const adjustedY = e.clientY - tracksContainer.getBoundingClientRect().y;

    // Check if the dragged element is near the right edge of the container
    if (adjustedX + elementWidth >= rightBound) {
      scrollContainer(tracksContainer, 'right');
    } else if (adjustedX < 0) {
      scrollContainer(tracksContainer, 'left');
    } else if (adjustedY >= bottomBound) {
      scrollContainer(tracksContainer, 'bottom');
    } else if (adjustedY <= timelineRulerHeight + trackHeight / 2) {
      scrollContainer(tracksContainer, 'top');
    } else {
      stopAutoScroll();
    }
  };

  // renders all el on timeline tracks based on their layer levels
  const renderElements = () => {
    return tracksClone.map(track => {
      return (
        <div
          key={track.id}
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
            const { startFrame, endFrame, id, type } = element;
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
                    currentTrack: track.layer,
                  });
                }}
                onDrag={(deltaX, data, e) => {
                  handleOnDrag({
                    id,
                    width,
                    posY: data.y,
                    deltaX,
                    startFrame,
                    endFrame,
                    layer: track.layer,
                  });

                  handleDragToEdge(data, width, e);
                }}
                onDragStop={() => {
                  handleDragEnd({ id, layer: track.layer });
                  resetDragElPos();
                  setCreateNewTrack(undefined);
                  stopAutoScroll();
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
                <TrackElement
                  id={id}
                  type={type}
                  key={id}
                  isTrackLocked={!track.isLocked || !track.isHidden}
                />
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

      {/* placeholder for element when its dragged  */}

      {currentDragEl.id ? (
        <>
          <div
            className='bg-brand-primary bg-opacity-50 rounded-md border-2 border-dashed border-slate-100 absolute top-0 left-0'
            style={{
              width: (currentDragEl.endFrame - currentDragEl.startFrame) * frameWidth,
              height: trackHeight - TRACK_PADDING_SPACING,
              left: currentDragEl.startFrame * frameWidth + 'px',
              top: (currentDragEl.currentTrack - 1) * trackHeight || TRACK_PADDING_SPACING / 2 + 'px',
            }}
          ></div>
        </>
      ) : null}

      {/* new track line: show a a line between tracks when the element is hovered there */}
      {createNewTrack ? (
        <>
          <div
            className='w-full h-1 absolute bg-brand-primary left-0'
            style={{
              top: (createNewTrack.trackNum - 1) * (trackHeight - 2) + 'px',
            }}
          >
            <div
              className='absolute -top-[.36rem] bg-slate-200 rounded-full text-brand-primary h-4 w-4 flex justify-center items-center font-medium scale-125 pb-px'
              style={{
                left: timelineVisibleWidth / 2 + 'px',
              }}
            >
              +
            </div>
          </div>
        </>
      ) : null}

      {/* reference lines when two or more elements have same frames */}
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
