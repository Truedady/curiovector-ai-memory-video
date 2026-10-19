import {Easing, interpolate} from 'remotion';
import {FPS} from './timeline';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.5, 0, 0.75, 0);

/** Progress 0→1 between two times (seconds) given the current time (seconds). */
export const prog = (t: number, start: number, end: number, ease: (n: number) => number = easeInOut) =>
  interpolate(t, [start, end], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Fade in at [a, a+d] and out at [b-d2, b]. */
export const fadeWin = (t: number, a: number, b: number, d = 0.4, d2 = d) =>
  Math.min(prog(t, a, a + d, easeOut), 1 - prog(t, b - d2, b, easeIn));

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const secs = (frame: number) => frame / FPS;

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
