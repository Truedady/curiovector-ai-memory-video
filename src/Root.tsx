import React from 'react';
import {Composition} from 'remotion';
import {loadFonts} from './fonts';
import {MemoryVideo} from './MemoryVideo';
import {DURATION_FRAMES, FPS} from './timeline';

loadFonts();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CurioVectorMemoryLandscape"
      component={MemoryVideo}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="CurioVectorMemoryShorts"
      component={MemoryVideo}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
