import React from 'react';
import {useVideoConfig} from 'remotion';

export const useLayout = () => {
  const {width, height} = useVideoConfig();
  return {W: width, H: height, P: height > width};
};

export type SceneProps = {t: number};

/** Map a point in photo coordinates (800x600) to screen for a card centred at (x,y) with art width w. */
export const photoPt = (x: number, y: number, w: number, px: number, py: number) => ({
  x: x - w / 2 + (px / 800) * w,
  y: y - (w * 0.75) / 2 + (py / 600) * w * 0.75,
});

/** Absolutely positions children centred on (x, y). */
export const At: React.FC<{x: number; y: number; o?: number; s?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  x,
  y,
  o = 1,
  s = 1,
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${s})`,
      opacity: o,
      textAlign: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);
