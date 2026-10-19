import React from 'react';
import {FaceBase, FaceExpression, MAN, WOMAN} from './Face';

/** Native size of the illustrated photograph (4:3). */
export const PHOTO_W = 800;
export const PHOTO_H = 600;

export type LayerKey = 'sky' | 'place' | 'clothing' | 'faces' | 'expressions';
export type LayerT = {x?: number; y?: number; rot?: number; scale?: number; opacity?: number};

const LAYER_PIVOT: Record<LayerKey, [number, number]> = {
  sky: [400, 200],
  place: [600, 330],
  clothing: [400, 470],
  faces: [400, 210],
  expressions: [400, 230],
};

// Head placement shared by every layer so the edit lines up exactly.
export const HEAD_A = {x: 318, y: 228, rot: 5, scale: 1.0};
export const HEAD_B = {x: 490, y: 216, rot: -2, scale: 1.04};

const layerTransform = (key: LayerKey, t?: LayerT) => {
  if (!t) return undefined;
  const [px, py] = LAYER_PIVOT[key];
  const {x = 0, y = 0, rot = 0, scale = 1} = t;
  return `translate(${x} ${y}) translate(${px} ${py}) rotate(${rot}) scale(${scale}) translate(${-px} ${-py})`;
};

const Layer: React.FC<{k: LayerKey; t?: LayerT; children: React.ReactNode}> = ({k, t, children}) => (
  <g transform={layerTransform(k, t)} opacity={t?.opacity ?? 1}>
    {children}
  </g>
);

const headT = (h: typeof HEAD_A) => `translate(${h.x} ${h.y}) rotate(${h.rot}) scale(${h.scale})`;

export type PhotoArtProps = {
  uid: string;
  smileA: number;
  smileB: number;
  layers?: Partial<Record<LayerKey, LayerT>>;
  /** A second, separately animated expression layer (e.g. the AI smile fragment). */
  ghostExpression?: {smile: number; t: LayerT; glow: number};
  /** 0..1 cyan tracing of the edited detail (faces + mouths). */
  trace?: number;
  /** 0..1 strength of the AI shimmer sweep, sweepPos 0..1 across. */
  sweep?: number;
  sweepPos?: number;
  /** vintage finish: warm fade, vignette, grain */
  vintage?: boolean;
  hideLayers?: LayerKey[];
};

const Sky: React.FC<{uid: string}> = ({uid}) => (
  <g>
    <defs>
      <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7E9DB4" />
        <stop offset="55%" stopColor="#C9C6BC" />
        <stop offset="100%" stopColor="#F2C99B" />
      </linearGradient>
      <radialGradient id={`sun-${uid}`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#FFF1D6" stopOpacity={1} />
        <stop offset="35%" stopColor="#FFD9A2" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#FFC58A" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={PHOTO_W} height={330} fill={`url(#sky-${uid})`} />
    <circle cx={612} cy={300} r={150} fill={`url(#sun-${uid})`} />
    {/* soft clouds */}
    <g fill="#F4EBDD" opacity={0.55}>
      <ellipse cx={130} cy={92} rx={110} ry={16} />
      <ellipse cx={200} cy={80} rx={70} ry={14} />
      <ellipse cx={640} cy={120} rx={120} ry={13} />
      <ellipse cx={560} cy={108} rx={60} ry={10} />
    </g>
    {/* gulls */}
    <g stroke="#4D5866" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7}>
      <path d="M 150 160 q 7 -7 14 0 q 7 -7 14 0" />
      <path d="M 190 140 q 5 -5 10 0 q 5 -5 10 0" />
      <path d="M 700 70 q 6 -6 12 0 q 6 -6 12 0" />
    </g>
  </g>
);

const Place: React.FC<{uid: string}> = ({uid}) => (
  <g>
    <defs>
      <linearGradient id={`sea-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7C9AA0" />
        <stop offset="100%" stopColor="#3F6670" />
      </linearGradient>
    </defs>
    {/* headland */}
    <path d="M 0 290 C 60 250 140 252 200 280 C 230 292 260 300 290 318 L 0 318 Z" fill="#5E7268" />
    <path d="M 0 300 C 70 276 150 280 230 310 L 0 318 Z" fill="#4A5E57" />
    {/* sea */}
    <rect x={0} y={316} width={PHOTO_W} height={150} fill={`url(#sea-${uid})`} />
    <g stroke="#F6E2C4" strokeWidth={2} opacity={0.45} strokeLinecap="round">
      <path d="M 520 330 h 70 M 610 336 h 90 M 560 346 h 60 M 650 352 h 80 M 700 330 h 40" />
      <path d="M 40 340 h 50 M 120 356 h 70 M 60 372 h 40" opacity={0.6} />
    </g>
    {/* lighthouse on the jetty */}
    <path d="M 600 330 L 760 330 L 770 346 L 590 346 Z" fill="#6B5A4C" />
    <g transform="translate(690 0)">
      <path d="M -18 330 L -13 172 L 13 172 L 18 330 Z" fill="#F1E8DA" />
      <path d="M -16.4 280 L -15.2 248 L 15.2 248 L 16.4 280 Z" fill="#D9774A" />
      <path d="M -14.6 222 L -13.8 198 L 13.8 198 L 14.6 222 Z" fill="#D9774A" />
      <path d="M 4 172 L 13 172 L 18 330 L 8 330 Z" fill="#000" opacity={0.12} />
      <rect x={-17} y={166} width={34} height={7} fill="#3B3633" />
      <rect x={-10} y={146} width={20} height={20} fill="#FFE7B0" />
      <rect x={-10} y={146} width={20} height={20} fill="none" stroke="#3B3633" strokeWidth={2} />
      <path d="M -13 146 L 0 132 L 13 146 Z" fill="#3B3633" />
      <circle cx={0} cy={156} r={26} fill="#FFE9B8" opacity={0.35} />
    </g>
    {/* railing of the promenade */}
    <rect x={0} y={420} width={PHOTO_W} height={12} fill="#7A5A44" />
    <rect x={0} y={432} width={PHOTO_W} height={4} fill="#4E392C" opacity={0.6} />
    <rect x={0} y={470} width={PHOTO_W} height={9} fill="#6E503C" />
    {[30, 150, 650, 770].map((x) => (
      <rect key={x} x={x} y={420} width={12} height={180} fill="#6A4C39" />
    ))}
    <rect x={0} y={479} width={PHOTO_W} height={121} fill="#8C7462" />
    <g stroke="#6E5847" strokeWidth={2} opacity={0.6}>
      <path d="M 0 520 H 800 M 0 560 H 800" />
    </g>
  </g>
);

const Clothing: React.FC = () => (
  <g>
    {/* woman — mustard knit cardigan over cream blouse */}
    <path d="M 186 600 C 188 480 198 384 234 350 C 258 328 290 318 318 316 C 346 318 378 328 400 350 C 432 384 436 480 436 600 Z" fill="#D2913F" />
    <path d="M 294 322 L 318 384 L 342 322 C 330 316 306 316 294 322 Z" fill="#F2E6D2" />
    <path d="M 318 384 L 306 600 M 318 384 L 330 600" stroke="#B9782F" strokeWidth={3} />
    <path d="M 234 352 C 220 410 216 500 220 600 M 400 352 C 414 410 418 500 414 600" stroke="#A86A28" strokeWidth={3} fill="none" opacity={0.7} />
    <g fill="#F2E6D2" opacity={0.85}>
      {[420, 470, 520, 570].map((y) => (
        <circle key={y} cx={312 - (y - 384) * 0.05} cy={y} r={3.2} />
      ))}
    </g>
    {/* man — navy jacket, open-collar shirt */}
    <path d="M 384 600 C 386 472 394 372 430 338 C 454 316 474 308 492 308 C 512 308 536 316 560 338 C 600 374 612 472 614 600 Z" fill="#2E4364" />
    <path d="M 470 312 L 492 356 L 516 312 C 506 306 480 306 470 312 Z" fill="#E9EEF2" />
    <path d="M 470 312 L 448 346 L 486 404 L 492 356 Z" fill="#253854" />
    <path d="M 516 312 L 538 346 L 498 404 L 492 356 Z" fill="#253854" />
    <path d="M 492 356 L 492 600" stroke="#1D2C44" strokeWidth={3} />
    <path d="M 430 340 C 414 400 410 500 414 600 M 560 340 C 576 400 580 500 576 600" stroke="#1D2C44" strokeWidth={3} fill="none" opacity={0.8} />
    <circle cx={496} cy={450} r={4} fill="#1D2C44" />
    <circle cx={496} cy={510} r={4} fill="#1D2C44" />
    {/* soft shadow where they stand close */}
    <path d="M 384 600 C 386 472 394 372 430 338 L 418 356 C 402 400 398 480 400 600 Z" fill="#000" opacity={0.2} />
  </g>
);

export const PhotoArt: React.FC<PhotoArtProps> = ({
  uid,
  smileA,
  smileB,
  layers = {},
  ghostExpression,
  trace = 0,
  sweep = 0,
  sweepPos = 0,
  vintage = true,
  hideLayers = [],
}) => {
  const show = (k: LayerKey) => !hideLayers.includes(k);
  const traceLen = 420;
  return (
    <svg viewBox={`0 0 ${PHOTO_W} ${PHOTO_H}`} width="100%" height="100%" style={{display: 'block', overflow: 'visible'}}>
      <defs>
        <radialGradient id={`vig-${uid}`} cx="0.5" cy="0.48" r="0.72">
          <stop offset="55%" stopColor="#2B1A0C" stopOpacity={0} />
          <stop offset="100%" stopColor="#2B1A0C" stopOpacity={0.55} />
        </radialGradient>
        <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <linearGradient id={`sweep-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#43C5F5" stopOpacity={0} />
          <stop offset="50%" stopColor="#BFEFFF" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#43C5F5" stopOpacity={0} />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {show('sky') && (
        <Layer k="sky" t={layers.sky}>
          <Sky uid={uid} />
        </Layer>
      )}
      {show('place') && (
        <Layer k="place" t={layers.place}>
          <Place uid={uid} />
        </Layer>
      )}
      {show('clothing') && (
        <Layer k="clothing" t={layers.clothing}>
          <Clothing />
        </Layer>
      )}
      {show('faces') && (
        <Layer k="faces" t={layers.faces}>
          <g transform={headT(HEAD_A)}>
            <FaceBase look={WOMAN} uid={`${uid}a`} />
          </g>
          <g transform={headT(HEAD_B)}>
            <FaceBase look={MAN} uid={`${uid}b`} />
          </g>
        </Layer>
      )}
      {show('expressions') && (
        <Layer k="expressions" t={layers.expressions}>
          <g transform={headT(HEAD_A)}>
            <FaceExpression look={WOMAN} smile={smileA} uid={`${uid}a`} />
          </g>
          <g transform={headT(HEAD_B)}>
            <FaceExpression look={MAN} smile={smileB} uid={`${uid}b`} />
          </g>
        </Layer>
      )}
      {ghostExpression ? (
        <Layer k="expressions" t={ghostExpression.t}>
          {ghostExpression.glow > 0 ? (
            <g opacity={ghostExpression.glow}>
              {[HEAD_A, HEAD_B].map((h, i) => (
                <ellipse key={i} cx={h.x} cy={h.y + 16} rx={44} ry={40} fill="none" stroke="#FF923E" strokeWidth={3} filter={`url(#glow-${uid})`} />
              ))}
            </g>
          ) : null}
          <g transform={headT(HEAD_A)}>
            <FaceExpression look={WOMAN} smile={ghostExpression.smile} uid={`${uid}ga`} />
          </g>
          <g transform={headT(HEAD_B)}>
            <FaceExpression look={MAN} smile={ghostExpression.smile} uid={`${uid}gb`} />
          </g>
        </Layer>
      ) : null}
      {vintage ? (
        <g style={{pointerEvents: 'none'}}>
          <rect width={PHOTO_W} height={PHOTO_H} fill="#F3C98E" opacity={0.13} style={{mixBlendMode: 'multiply'}} />
          <rect width={PHOTO_W} height={PHOTO_H} fill="#FFF4E0" opacity={0.08} />
          <rect width={PHOTO_W} height={PHOTO_H} fill={`url(#vig-${uid})`} />
          <rect width={PHOTO_W} height={PHOTO_H} filter={`url(#grain-${uid})`} opacity={0.1} style={{mixBlendMode: 'overlay'}} />
        </g>
      ) : null}
      {trace > 0 ? (
        <g filter={`url(#glow-${uid})`} fill="none" stroke="#43C5F5" strokeLinecap="round">
          {[HEAD_A, HEAD_B].map((h, i) => (
            <g key={i} transform={headT(h)}>
              <path
                d="M 0 -64 C 34 -64 52 -38 52 -4 C 52 31 33 62 0 66 C -33 62 -52 31 -52 -4 C -52 -38 -34 -64 0 -64 Z"
                strokeWidth={2.4}
                strokeDasharray={`${traceLen} ${traceLen}`}
                strokeDashoffset={traceLen * (1 - trace)}
                opacity={0.9}
              />
              <rect x={-30} y={-22} width={60} height={70} rx={10} strokeWidth={1.6} strokeDasharray="5 5" opacity={0.85 * trace} />
              {[[-30, -22], [30, -22], [-30, 48], [30, 48]].map(([x, y], j) => (
                <rect key={j} x={x - 3} y={y - 3} width={6} height={6} fill="#08132F" strokeWidth={1.6} opacity={trace} />
              ))}
            </g>
          ))}
        </g>
      ) : null}
      {sweep > 0 ? (
        <rect
          x={-200 + sweepPos * (PHOTO_W + 200)}
          y={0}
          width={200}
          height={PHOTO_H}
          fill={`url(#sweep-${uid})`}
          opacity={sweep}
          style={{mixBlendMode: 'screen'}}
        />
      ) : null}
    </svg>
  );
};
