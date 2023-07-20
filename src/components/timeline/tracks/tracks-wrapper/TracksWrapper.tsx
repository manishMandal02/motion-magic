import { MouseEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DraggableData } from 'react-rnd';
import { nanoid } from 'nanoid';
import { produce } from 'immer';

import { TooltipRef } from '@/components/common/element-wrapper/timeline-element-wrapper/TimelineElementWrapper';
import { IElementFrameDuration } from '@/types/elements.type';
import { ReferenceLine, TimelineTrack, ITrackElement } from '@/types/timeline.type';
import { ResizeBound, getElResizeBounds } from '@/utils/timeline/getElResizeBounds';
import { handleOverlappingElements } from '@/utils/timeline/getOverlappingElements';
import { getOverlappingFrames } from '@/utils/timeline/getOverlappingFrames';
import { useEditorStore } from '@/store';
import { getRefLines } from '@/utils/timeline/showRefLines';

import TimelineElementWrapper from '@/components/common/element-wrapper/timeline-element-wrapper';
import TimelineElement from '../timeline-element';
import TimestampTooltip from '../timeline-element/timestamp-tooltip';

// track spacing top & bottom
const TRACK_PADDING_SPACING = 6;

// initial data for tooltip ref object
const tooltipRefInitialData: TooltipRef = {
  elementId: '',
  startFrame: null,
  endFrame: null,
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
  isOnElementConnector: boolean;
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
    isOnElementConnector: false,
  });

  //  new track
  const [createNewTrack, setCreateNewTrack] = useState<CreateTrackOnDragParams | undefined>(undefined);
  // array of frames to show reference lines
  const [showRefLines, setShowRefLines] = useState<ReferenceLine[]>([]);
  // time stamp tooltip
  const showTooltipRef = useRef<TooltipRef>(tooltipRefInitialData);

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
    console.log('🚀 ~ file: TracksWrapper.tsx:128 ~ scrollDirection:', scrollDirection);

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
      isOnElementConnector: false,
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
        setCurrentDragEl: setCurrentDragEl,
      });

      if (!isOverlappingWithOtherElements) {
        setCurrentDragEl({
          id,
          currentTrack: currentTrackOfEl,
          startFrame: newStartFrame,
          endFrame: newEndFrame,
          isOnElementConnector: false,
        });
      } else {
        setCurrentDragEl(prev => ({ ...prev, currentTrack: currentTrackOfEl }));
      }

      // check for overlapping frames with current active el frames
      const refLines = getRefLines({
        startFrame: isOverlappingWithOtherElements ? currentDragEl.startFrame : newStartFrame,
        endFrame: isOverlappingWithOtherElements ? currentDragEl.endFrame : newEndFrame,

        tracks: tracksClone,
        currentElId: id,
        currentTrack: currentTrackOfEl,
      });

      // show ref line if active el frames are overlapping
      if (refLines.length > 0) {
        setShowRefLines(refLines);
      } else {
        setShowRefLines([]);
      }
    }

    // show timestamp tooltips on both the ends
    showTooltipRef.current.elementId = id;
    showTooltipRef.current.startFrame = currentDragEl.startFrame;

    showTooltipRef.current.endFrame = currentDragEl.endFrame;

    console.log('🚀 ~ file: TracksWrapper.tsx:414 ~ handleOnDrag ~ currentDragEl:', currentDragEl);
  };

  // handle drag end elements
  const handleDragEnd = ({ id, layer }: HandleDragEndProps) => {
    //check if the if the drag was for create new track (users stopped in between the tracks), if yes then handle it
    if (createNewTrack?.trackNum && !currentDragEl.id) {
      createNewTrackOnDrag(createNewTrack);
      return;
    }

    //Temporary: solution-  for elements flickering after onDrag completed (it goes to it's previous track and then shit back to new track)
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
    } else {
      setTracksClone([...tracks]);
    }
    updateAllTimelineTracks(currentDragEl, layer);
  };

  // handle element dragged to the edge of container
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

    //TODO: fix the infinite scroll to bottom

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

  const renderElementConnectors = () => {
    return tracksClone.map(track => {
      // loop though all the elements to find the ones that connect with others (no space/time-frames in between)
      console.log('🚀 ~ file: TracksWrapper.tsx:541 ~ renderElementConnectors ~ track:', track);
      return (
        <div className='' style={{}}>
          {track.elements.map(element => {
            console.log('🚀 ~ file: TracksWrapper.tsx:488 ~ renderElementConnectors ~ element:', element);

            const width = (element.endFrame - element.startFrame) * frameWidth;
            let showLeftConnector = false;
            let showRightConnector = false;
            // loop through all other elements to check if element 👆 is connecting with other elements
            for (const elLoop of track.elements) {
              if (element.startFrame - 1 === elLoop.endFrame && element.id !== elLoop.id) {
                showLeftConnector = true;

                console.log(
                  '🚀 ~ file: TracksWrapper.tsx:495 ~ renderElementConnectors ~ showLeftConnector:'
                );
              }
              if (element.endFrame + 1 === elLoop.startFrame && element.id !== elLoop.id) {
                showRightConnector = true;

                console.log(
                  '🚀 ~ file: TracksWrapper.tsx:500 ~ renderElementConnectors ~ showRightConnector:'
                );
              }
            }

            if (showRightConnector) {
              console.log(
                '🚀 ~ file: TracksWrapper.tsx:510 ~ renderElementConnectors ~ showRightConnector: rendering 🔥🔥🔥',
                showRightConnector
              );

              return (
                <>
                  <div
                    className='absolute w-3 bg-brand-darkSecondary  rounded-md -right-2 top-0 z-[50] opacity-80.'
                    style={{
                      width: '12px',
                      height: trackHeight - TRACK_PADDING_SPACING * 2,
                      left: element.startFrame * frameWidth + width - 5,
                      top: trackHeight * (track.layer - 1) + TRACK_PADDING_SPACING,
                    }}
                  ></div>
                </>
              );
            }

            if (showLeftConnector) {
              return (
                <>
                  <div
                    className='absolute w-3 bg-brand-darkSecondary rounded-md -right-2 top-0 z-[50] opacity-80.'
                    style={{
                      width: '12px',
                      height: trackHeight - TRACK_PADDING_SPACING * 2,
                      left: element.startFrame * frameWidth - 5,
                      top: trackHeight * (track.layer - 1) + TRACK_PADDING_SPACING,
                    }}
                  ></div>
                </>
              );
            }

            if (showRightConnector && showLeftConnector) {
              return (
                <>
                  {/* left side connector  */}

                  <>
                    <div
                      className='absolute w-3 bg-brand-darkSecondary  rounded-md -right-2 top-0 z-[50] opacity-80.'
                      style={{
                        width: '12px',
                        height: trackHeight - TRACK_PADDING_SPACING * 2,
                        left: element.startFrame * frameWidth + width - 5,
                        top: trackHeight * (track.layer - 1) + TRACK_PADDING_SPACING,
                      }}
                    ></div>
                  </>

                  {/* right side connector */}

                  <>
                    <div
                      className='absolute w-3 bg-brand-darkSecondary rounded-md -right-2 top-0 z-[50] opacity-80.'
                      style={{
                        width: '12px',
                        height: trackHeight - TRACK_PADDING_SPACING * 2,
                        left: element.startFrame * frameWidth - 5,
                        top: trackHeight * (track.layer - 1) + TRACK_PADDING_SPACING,
                      }}
                    ></div>
                  </>
                </>
              );
            }
          })}
          ;
        </div>
      );
    });
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
                    isOnElementConnector: false,
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
                <TimelineElement
                  id={id}
                  type={type}
                  key={id}
                  isTrackLocked={track.isLocked || track.isHidden}
                />
              </TimelineElementWrapper>
            );
          })}
          <>{/* connector in between elements with no time frames/space */}</>
        </div>
      );
    });
  };

  return (
    <>
      {/* tracks and elements within tracks */}
      {renderElements()}
      {/* connector in between elements with no time frames/space */}
      {renderElementConnectors()}
      {/* placeholder for element when its dragged  */}
      {currentDragEl.id && !createNewTrack ? (
        !currentDragEl.isOnElementConnector ? (
          // el placeholder while dragging
          <div
            className='absolute'
            style={{
              width: (currentDragEl.endFrame - currentDragEl.startFrame) * frameWidth,
              height: trackHeight - TRACK_PADDING_SPACING,
              left: currentDragEl.startFrame * frameWidth + 'px',
              top:
                (currentDragEl.currentTrack - 1) * trackHeight + TRACK_PADDING_SPACING / 2 ||
                TRACK_PADDING_SPACING / 2 + 'px',
            }}
          >
            <TimestampTooltip
              startTime={showTooltipRef.current.startFrame}
              endTime={showTooltipRef.current.endFrame}
              isOpen={!!showTooltipRef.current.startFrame || !!showTooltipRef.current.endFrame}
            >
              <div className='bg-brand-primary bg-opacity-50 rounded-md border-2 border-dashed border-slate-100 h-full w-full'></div>
            </TimestampTooltip>
          </div>
        ) : (
          // Show placeholder on element connector/transition box in between line (a big in between elements)
          <div
            className='bg-brand-secondary border border-brand-darkSecondary border-opacity-80 rounded-md z-[50] absolute'
            style={{
              width: 10 + 'px',
              height: trackHeight - TRACK_PADDING_SPACING,
              left: currentDragEl.startFrame * frameWidth - 5 + 'px',
              top:
                (currentDragEl.currentTrack - 1) * trackHeight + TRACK_PADDING_SPACING / 2 ||
                TRACK_PADDING_SPACING / 2 + 'px',
            }}
          >
            {/* <div className='absolute bg-brand-primary rounded-full text-slate-100  top-3.5 text-[.65rem]  '>
              +
            </div> */}
          </div>
        )
      ) : null}
      {/* new track line: show a a line between tracks when the element is hovered there */}
      {createNewTrack ? (
        <>
          <div
            className='w-full h-[3px] absolute bg-brand-primary left-0'
            style={{
              top: (createNewTrack.trackNum - 1) * (trackHeight - 0.8) + 'px',
            }}
          >
            <div
              className='absolute -top-[.38rem] bg-brand-primary rounded-full text-white h-4 w-4 flex justify-center items-center font-medium scale-125 pb-px'
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
            const linePosY = (line.startTrack - 1) * trackHeight;

            // minus 26 so that they don't touch the border of the other tracks
            const lineHeight = (line.endTrack + 1 - line.startTrack) * trackHeight;

            return (
              <hr
                className={`w-[2.2px]  h-[${lineHeight}px] rounded-sm absolute top-0 z-[60] bg-transparent CC_dashedBorder_Ref_Lines`}
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
