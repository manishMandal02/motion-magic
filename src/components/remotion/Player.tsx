import { Player, PlayerRef, RenderLoading } from '@remotion/player';
import { MyComposition } from './Composition';
import { useCallback, useEffect, useRef } from 'react';
import { AbsoluteFill } from 'remotion';
import { useEditorSore } from '@/store';

export const ArtBoardPlayer: React.FC = () => {
  // playerRef:  to manipulate player
  const playerRef = useRef<PlayerRef | null>(null);

  // global state
  const currentFrame = useEditorSore((state) => state.currentFrame);

  useEffect(() => {
    if (playerRef) {
      playerRef.current?.seekTo(currentFrame);
    }
  }, [currentFrame]);

  console.log('scale', playerRef.current?.getScale());

  const renderLoading: RenderLoading = useCallback(({ height, width }) => {
    return (
      <AbsoluteFill style={{ backgroundColor: 'gray' }}>
        Loading player ({height}x{width})
      </AbsoluteFill>
    );
  }, []);

  return (
    <Player
      component={MyComposition}
      //   inputProps={}
      ref={playerRef}
      durationInFrames={120}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      playbackRate={1}
      moveToBeginningWhenEnded={false}
      initiallyShowControls={false}
      style={{
        width: '672px',
        height: '378px',
      }}
      // alwaysShowControls
      // allowFullscreen
      // doubleClickToFullscreen
      //TODO: create a component for loading art board as in docs
      renderLoading={renderLoading}
      //   numberOfSharedAudioTags={2}
      //   errorFallback={}
    />
  );
};
