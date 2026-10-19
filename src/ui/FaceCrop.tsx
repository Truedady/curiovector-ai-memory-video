import React from 'react';
import {PhotoArt} from '../art/PhotoArt';

/** Circular fragment showing only the couple's faces from the photograph. */
export const FaceCrop: React.FC<{
  uid: string;
  size: number;
  smile: number;
  x: number;
  y: number;
  ring: string;
  ringGlow?: number;
  opacity?: number;
  scale?: number;
  filter?: string;
}> = ({uid, size, smile, x, y, ring, ringGlow = 0.6, opacity = 1, scale = 1, filter}) => {
  // faces region in photo coordinates: centred (404, 238), ~330 px wide
  const span = 330;
  const k = size / span;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        opacity,
        transform: `scale(${scale})`,
        border: `${Math.max(3, size * 0.012)}px solid ${ring}`,
        boxShadow: `0 0 ${size * 0.12 * ringGlow}px ${ring}, 0 20px 60px rgba(0,0,0,0.5)`,
        filter,
      }}
    >
      <div style={{position: 'absolute', left: -(404 - span / 2) * k, top: -(238 - span / 2) * k, width: 800 * k, height: 600 * k}}>
        <PhotoArt uid={uid} smileA={smile} smileB={smile} />
      </div>
    </div>
  );
};
