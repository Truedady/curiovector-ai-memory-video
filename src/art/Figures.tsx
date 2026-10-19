import React from 'react';
import {C} from '../theme';

const PROFILE =
  'M 150 500 C 150 440 140 404 118 372 C 78 330 58 270 62 208 C 70 108 150 46 242 46 C 322 46 374 98 384 168 C 388 194 384 214 388 228 C 394 246 412 268 420 290 C 424 300 416 308 402 308 C 404 318 406 326 400 332 C 408 338 406 346 398 350 C 402 358 400 368 392 374 C 394 394 382 412 352 416 C 330 418 312 418 302 422 C 298 444 302 470 306 500 Z';

/**
 * The central illustrated character in profile (facing right), used for the
 * memory scenes. Navy body with cyan rim light — viewBox 0 0 460 500.
 */
export const Thinker: React.FC<{uid: string; glow?: number; eyeOpen?: number}> = ({uid, glow = 0.6, eyeOpen = 1}) => (
  <svg viewBox="0 0 460 500" width="100%" height="100%" style={{overflow: 'visible', display: 'block'}}>
    <defs>
      <linearGradient id={`th-fill-${uid}`} x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0%" stopColor="#0B1838" />
        <stop offset="70%" stopColor="#14295E" />
        <stop offset="100%" stopColor="#1C3A7A" />
      </linearGradient>
      <linearGradient id={`th-hair-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#060E26" />
        <stop offset="100%" stopColor="#0F1F4A" />
      </linearGradient>
      <filter id={`th-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id={`th-clip-${uid}`}>
        <path d={PROFILE} />
      </clipPath>
    </defs>
    <path d={PROFILE} fill={`url(#th-fill-${uid})`} />
    <g clipPath={`url(#th-clip-${uid})`}>
      {/* hair mass */}
      <path d="M 40 300 C 30 160 110 30 250 36 C 330 40 372 80 384 140 C 340 110 300 100 268 112 C 236 124 220 160 214 210 C 206 260 190 300 160 330 C 120 350 70 340 40 300 Z" fill={`url(#th-hair-${uid})`} />
      <path d="M 268 70 C 300 74 336 92 360 122" stroke={C.cyan} strokeWidth={2} fill="none" opacity={0.25} />
      <path d="M 200 70 C 150 90 110 140 100 200" stroke={C.cyan} strokeWidth={2} fill="none" opacity={0.15} />
      {/* ear */}
      <path d="M 214 228 C 196 212 176 222 178 248 C 180 272 196 286 214 280" fill="#1A3470" stroke={C.cyan} strokeWidth={1.5} strokeOpacity={0.35} />
      <path d="M 204 240 C 194 238 190 252 198 262" stroke={C.cyan} strokeWidth={1.4} fill="none" opacity={0.3} />
      {/* warm under-light on the jaw */}
      <ellipse cx={330} cy={400} rx={80} ry={40} fill={C.orange} opacity={0.08} />
    </g>
    {/* eye + brow */}
    <path d="M 334 216 C 344 210 356 210 364 214" stroke="#9FD9F2" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
    <path
      d={`M 342 ${234 - 4 * eyeOpen} Q 352 ${230 - 5 * eyeOpen} 362 236 Q 352 ${238 + 2 * eyeOpen} 342 ${234 - 4 * eyeOpen} Z`}
      fill="#CFF1FF"
      opacity={0.85}
    />
    <path d="M 340 232 Q 352 224 364 234" stroke="#CFF1FF" strokeWidth={1.6} fill="none" opacity={0.5} />
    {/* cyan rim light along the face */}
    <path
      d="M 242 46 C 322 46 374 98 384 168 C 388 194 384 214 388 228 C 394 246 412 268 420 290 C 424 300 416 308 402 308 C 404 318 406 326 400 332 C 408 338 406 346 398 350 C 402 358 400 368 392 374 C 394 394 382 412 352 416"
      stroke={C.cyan}
      strokeWidth={3}
      fill="none"
      filter={`url(#th-glow-${uid})`}
      opacity={glow}
    />
    <path d="M 62 208 C 70 108 150 46 242 46" stroke={C.orange} strokeWidth={2} fill="none" opacity={0.35 * glow} />
  </svg>
);

/** Stylized brain in side view (cyan line art). viewBox 0 0 400 320. */
export const Brain: React.FC<{uid: string; draw?: number; glow?: number}> = ({uid, draw = 1, glow = 0.7}) => {
  const len = 1400;
  const dash = {strokeDasharray: `${len} ${len}`, strokeDashoffset: len * (1 - draw)};
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%" style={{overflow: 'visible', display: 'block'}}>
      <defs>
        <radialGradient id={`br-fill-${uid}`} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.22} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0.04} />
        </radialGradient>
        <filter id={`br-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#br-glow-${uid})`} opacity={0.4 + 0.6 * glow}>
        <path
          d="M 70 190 C 34 170 34 110 74 92 C 80 50 130 26 170 40 C 200 14 258 18 278 46 C 322 40 360 74 356 116 C 384 140 378 196 342 208 C 336 236 302 252 276 242 C 256 262 220 266 200 250 C 178 266 138 262 124 240 C 92 246 64 222 70 190 Z"
          fill={`url(#br-fill-${uid})`}
          stroke={C.cyan}
          strokeWidth={3.5}
          {...dash}
        />
        <g stroke={C.cyan} strokeWidth={2.5} fill="none" strokeLinecap="round" {...dash} opacity={0.85}>
          <path d="M 110 90 C 130 110 120 140 150 150 C 180 160 176 120 206 118" />
          <path d="M 180 46 C 176 70 200 84 222 76 C 246 68 252 96 276 92" />
          <path d="M 300 70 C 290 100 316 120 300 146 C 288 166 318 182 336 170" />
          <path d="M 86 140 C 104 160 96 190 124 196 C 150 202 160 182 186 190" />
          <path d="M 214 150 C 236 170 270 150 286 176 C 298 196 278 220 300 226" />
          <path d="M 160 214 C 180 196 210 204 226 222" />
          <path d="M 240 110 C 252 130 236 150 252 166" />
        </g>
        {/* cerebellum + stem */}
        <path d="M 276 242 C 296 268 330 262 334 236" stroke={C.cyan} strokeWidth={2.5} fill="none" {...dash} />
        <path d="M 250 250 C 252 274 246 296 236 312" stroke={C.cyan} strokeWidth={3} fill="none" {...dash} />
      </g>
    </svg>
  );
};

/** Vintage cine camera (line art). viewBox 0 0 360 260. */
export const Camera: React.FC<{uid: string; rec?: number; reel?: number}> = ({uid, rec = 1, reel = 0}) => (
  <svg viewBox="0 0 360 260" width="100%" height="100%" style={{overflow: 'visible', display: 'block'}}>
    <defs>
      <linearGradient id={`cam-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A3470" />
        <stop offset="100%" stopColor="#0C1A3F" />
      </linearGradient>
    </defs>
    {[90, 190].map((cx, i) => (
      <g key={cx} transform={`translate(${cx} 62) rotate(${reel * (i ? 1.3 : 1)})`}>
        <circle r={52} fill={`url(#cam-${uid})`} stroke={C.cyan} strokeWidth={3} />
        {[0, 120, 240].map((a) => (
          <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 28} cy={Math.sin((a * Math.PI) / 180) * 28} r={11} fill="#08132F" stroke={C.cyan} strokeWidth={2} opacity={0.8} />
        ))}
        <circle r={7} fill={C.cyan} />
      </g>
    ))}
    <rect x={30} y={110} width={230} height={120} rx={14} fill={`url(#cam-${uid})`} stroke={C.cyan} strokeWidth={3} />
    <path d="M 260 140 L 330 118 L 330 222 L 260 200 Z" fill="#0C1A3F" stroke={C.cyan} strokeWidth={3} strokeLinejoin="round" />
    <ellipse cx={330} cy={170} rx={12} ry={52} fill="#08132F" stroke={C.cyan} strokeWidth={3} />
    <ellipse cx={330} cy={170} rx={6} ry={30} fill={C.cyan} opacity={0.35} />
    <rect x={56} y={136} width={70} height={40} rx={6} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.6} />
    <circle cx={226} cy={140} r={9} fill={C.orange} opacity={0.35 + 0.65 * rec} />
    <path d="M 70 230 L 110 256 M 220 230 L 180 256" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
  </svg>
);

/** Reusable participant symbol definition (render once per SVG). */
export const ParticipantSymbol: React.FC = () => (
  <symbol id="cv-person" viewBox="-10 -12 20 26">
    <circle cx={0} cy={-5.5} r={4.6} />
    <path d="M -8.5 13 C -8.5 4 -5 1 0 1 C 5 1 8.5 4 8.5 13 Z" />
  </symbol>
);
