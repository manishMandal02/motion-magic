import { Composition } from 'remotion';
import { MyComposition } from './Composition';

export const MyVideo = () => {
  return (
    <>
      <Composition
        component={MyComposition}
        durationInFrames={120}
        width={1920}
        height={1080}
        fps={30}
        id='MyVideo'
      />
    </>
  );
};
