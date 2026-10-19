import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {rand} from '../anim';
import {C} from '../theme';

/** Deep navy cinematic environment: layered light pools, drifting dust, vignette. */
export const Backdrop: React.FC<{t: number; warm?: number; cyan?: number; focusX?: number; focusY?: number}> = ({
  t,
  warm = 0.35,
  cyan = 0.5,
  focusX = 0.5,
  focusY = 0.45,
}) => {
  const {width, height} = useVideoConfig();
  const dust = Array.from({length: 46}).map((_, i) => {
    const x = (rand(i) * width + t * (8 + rand(i + 9) * 18)) % width;
    const y = (rand(i + 50) * height - t * (5 + rand(i + 3) * 10) + height * 10) % height;
    const r = 1 + rand(i + 99) * 2.4;
    const o = 0.12 + 0.3 * rand(i + 7) * (0.6 + 0.4 * Math.sin(t * 0.9 + i));
    return <circle key={i} cx={x} cy={y} r={r} fill={i % 5 === 0 ? C.orange : C.cyan} opacity={o} />;
  });
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${focusX * 100}% ${focusY * 100}%, rgba(17,36,86,${0.9}) 0%, rgba(8,19,47,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${focusX * 100 + 18}% ${focusY * 100 - 20}%, rgba(67,197,245,${0.16 * cyan}) 0%, rgba(67,197,245,0) 45%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${focusX * 100 - 22}% ${focusY * 100 + 30}%, rgba(255,146,62,${0.12 * warm}) 0%, rgba(255,146,62,0) 42%)`,
        }}
      />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        {dust}
      </svg>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(4,10,28,0) 55%, rgba(4,10,28,0.85) 100%)'}}
      />
    </AbsoluteFill>
  );
};
