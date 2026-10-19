import React from 'react';
import {staticFile} from 'remotion';
import {C} from '../theme';
import {FaceBase, FaceExpression, PersonLook} from './Face';

const Glow: React.FC<{id: string; sd?: number}> = ({id, sd = 4}) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation={sd} result="b" />
    <feMerge>
      <feMergeNode in="b" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

/** Small framed vignette photo used inside the album. viewBox 0 0 200 150 */
const MiniPrint: React.FC<{kind: number; change?: number; uid: string}> = ({kind, change = 0, uid}) => {
  if (kind === 0) {
    // birthday cake — candles become lit (the AI detail)
    return (
      <g>
        <rect width={200} height={150} fill="#6E5A4A" />
        <rect y={96} width={200} height={54} fill="#8C6C52" />
        <ellipse cx={100} cy={100} rx={70} ry={12} fill="#EFE3D0" />
        <rect x={45} y={64} width={110} height={36} fill="#E9C9A8" />
        <ellipse cx={100} cy={64} rx={55} ry={10} fill="#F6E7D6" />
        <path d="M 45 76 Q 72 84 100 76 Q 128 84 155 76" stroke="#D9774A" strokeWidth={4} fill="none" />
        {[70, 90, 110, 130].map((x, i) => (
          <g key={x}>
            <rect x={x - 2.5} y={42} width={5} height={20} fill={i % 2 ? '#7FB7D6' : '#F2A774'} />
            <g opacity={change}>
              <ellipse cx={x} cy={34} rx={5} ry={9} fill="#FFD27A" filter={`url(#g-${uid})`} />
              <ellipse cx={x} cy={36} rx={2.5} ry={5} fill="#FFF6DA" />
            </g>
          </g>
        ))}
        <rect width={200} height={150} fill="#000" opacity={0.25 * (1 - change)} />
      </g>
    );
  }
  if (kind === 1) {
    return (
      <g>
        <rect width={200} height={150} fill="#A9B7A4" />
        <rect y={90} width={200} height={60} fill="#6F8A5E" />
        <path d="M 30 90 L 60 40 L 90 90 Z" fill="#E7E0D2" />
        <rect x={110} y={56} width={60} height={34} fill="#C47A55" />
        <path d="M 104 58 L 140 34 L 176 58 Z" fill="#7A4A3A" />
      </g>
    );
  }
  if (kind === 2) {
    return (
      <g>
        <rect width={200} height={150} fill="#C9B79C" />
        {[60, 100, 140].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={62} r={14} fill={['#5B3A2A', '#2A211E', '#8A6A4A'][i]} />
            <circle cx={x} cy={66} r={11} fill="#E3B08E" />
            <path d={`M ${x - 18} 150 C ${x - 18} 100 ${x - 10} 84 ${x} 84 C ${x + 10} 84 ${x + 18} 100 ${x + 18} 150 Z`} fill={['#7FA0B8', '#B85B4A', '#5E7D5A'][i]} />
          </g>
        ))}
      </g>
    );
  }
  return (
    <g>
      <rect width={200} height={150} fill="#8FA6B8" />
      <circle cx={150} cy={40} r={18} fill="#F6E2B8" />
      <path d="M 0 110 C 40 90 80 100 120 86 C 150 76 180 84 200 80 L 200 150 L 0 150 Z" fill="#4E6B5A" />
    </g>
  );
};

/** Open family album. viewBox 0 0 900 560 */
export const Album: React.FC<{uid: string; change: number; highlight: number}> = ({uid, change, highlight}) => {
  const slots = [
    {x: 70, y: 70, r: -3, k: 1},
    {x: 70, y: 300, r: 2, k: 2},
    {x: 500, y: 80, r: 2.5, k: 0},
    {x: 500, y: 310, r: -2, k: 3},
  ];
  return (
    <svg viewBox="0 0 900 560" width="100%" height="100%" style={{overflow: 'visible', display: 'block'}}>
      <defs>
        <Glow id={`g-${uid}`} sd={3} />
        <Glow id={`gh-${uid}`} sd={8} />
        <linearGradient id={`pg-${uid}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#E8DCC4" />
          <stop offset="88%" stopColor="#F2E8D5" />
          <stop offset="100%" stopColor="#C9B997" />
        </linearGradient>
        <linearGradient id={`pg2-${uid}`} x1="1" x2="0">
          <stop offset="0%" stopColor="#E8DCC4" />
          <stop offset="88%" stopColor="#F2E8D5" />
          <stop offset="100%" stopColor="#C9B997" />
        </linearGradient>
      </defs>
      <rect x={10} y={14} width={880} height={540} rx={18} fill="#5B2E2A" />
      <rect x={30} y={30} width={420} height={500} fill={`url(#pg-${uid})`} />
      <rect x={450} y={30} width={420} height={500} fill={`url(#pg2-${uid})`} />
      <rect x={444} y={30} width={12} height={500} fill="#000" opacity={0.15} />
      {slots.map((s, i) => (
        <g key={i} transform={`translate(${s.x + 150} ${s.y + 100}) rotate(${s.r}) translate(-150 -100)`}>
          <rect x={-8} y={-8} width={316} height={216} fill="#FBF7EE" />
          <g transform="scale(1.5 1.333)">
            <MiniPrint kind={s.k} change={s.k === 0 ? change : 0} uid={uid} />
          </g>
          {[[-8, -8], [292, -8], [-8, 192], [292, 192]].map(([x, y], j) => (
            <path key={j} d={`M ${x} ${y} l 16 0 l -16 16 Z`} transform={`rotate(${[0, 90, 270, 180][j]} ${x + 8} ${y + 8})`} fill="#2B2422" opacity={0.75} />
          ))}
          {s.k === 0 ? (
            <rect x={-14} y={-14} width={328} height={228} fill="none" stroke={C.cyan} strokeWidth={4} rx={6} opacity={highlight} filter={`url(#gh-${uid})`} />
          ) : null}
        </g>
      ))}
    </svg>
  );
};

/** Vacation snapshot: a grey sky becomes a perfect sunny day. viewBox 0 0 800 600 */
export const Vacation: React.FC<{uid: string; change: number}> = ({uid, change}) => (
  <svg viewBox="0 0 800 600" width="100%" height="100%" style={{display: 'block'}}>
    <defs>
      <linearGradient id={`vs1-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8E969C" />
        <stop offset="100%" stopColor="#C2C3BE" />
      </linearGradient>
      <linearGradient id={`vs2-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3E8FC7" />
        <stop offset="100%" stopColor="#BFE3F0" />
      </linearGradient>
      <Glow id={`vg-${uid}`} sd={14} />
    </defs>
    <rect width={800} height={360} fill={`url(#vs1-${uid})`} />
    <rect width={800} height={360} fill={`url(#vs2-${uid})`} opacity={change} />
    <g opacity={1 - change} fill="#A7ABAA">
      <ellipse cx={200} cy={110} rx={180} ry={40} />
      <ellipse cx={560} cy={90} rx={220} ry={46} />
      <ellipse cx={400} cy={160} rx={260} ry={34} fill="#B3B6B3" />
    </g>
    <circle cx={640} cy={110} r={46} fill="#FFE7A6" opacity={change} filter={`url(#vg-${uid})`} />
    <rect y={330} width={800} height={110} fill="#2F7F9A" />
    <rect y={330} width={800} height={110} fill="#1E5C70" opacity={0.6 * (1 - change)} />
    <g stroke="#E8F7FA" strokeWidth={3} opacity={0.6} strokeLinecap="round">
      <path d="M 60 360 h 80 M 260 380 h 120 M 500 366 h 90 M 640 400 h 100" />
    </g>
    <path d="M 0 440 C 200 420 600 430 800 440 L 800 600 L 0 600 Z" fill="#E6CFA0" />
    {/* palm */}
    <path d="M 130 600 C 140 520 150 420 176 300" stroke="#5A4030" strokeWidth={16} fill="none" strokeLinecap="round" />
    <g fill="#3F6B43">
      <path d="M 176 300 C 120 270 80 290 50 320 C 100 300 140 300 176 300 Z" />
      <path d="M 176 300 C 220 250 280 260 310 290 C 260 280 220 286 176 300 Z" />
      <path d="M 176 300 C 160 240 180 210 210 190 C 196 230 188 260 176 300 Z" />
      <path d="M 176 300 C 130 320 110 360 110 390 C 130 350 150 330 176 300 Z" />
    </g>
    {/* beach umbrella + towel */}
    <path d="M 520 470 L 560 330" stroke="#F8FAFF" strokeWidth={5} />
    <path d="M 470 360 Q 560 270 650 330 Z" fill="#E86D3B" />
    <path d="M 500 344 Q 560 300 620 318" stroke="#F8FAFF" strokeWidth={6} fill="none" opacity={0.7} />
    <rect x={560} y={500} width={150} height={50} rx={6} fill="#43C5F5" transform="rotate(-6 635 525)" />
    <rect width={800} height={600} fill="#000" opacity={0.12 * (1 - change)} />
  </svg>
);

/** Old film frame being restored: grain → color, a figure starts to wave. viewBox 0 0 800 600 */
export const FilmFrame: React.FC<{uid: string; change: number; t: number}> = ({uid, change, t}) => {
  const wave = change * (Math.sin(t * 7) * 18 + 40);
  const flick = 0.06 * (1 - change) * (0.5 + 0.5 * Math.sin(t * 40));
  return (
    <svg viewBox="0 0 800 600" width="100%" height="100%" style={{display: 'block'}}>
      <defs>
        <pattern id={`fg-${uid}`} patternUnits="userSpaceOnUse" width={256} height={256} x={(Math.floor(t * 12) * 97) % 256} y={(Math.floor(t * 12) * 61) % 256}>
          <image href={staticFile('grain.png')} width={256} height={256} />
        </pattern>
      </defs>
      <g style={{filter: `grayscale(${1 - change}) sepia(${0.35 * (1 - change)}) contrast(${1 + 0.1 * change})`}}>
        <rect width={800} height={600} fill="#9CC3DA" />
        <rect y={300} width={800} height={300} fill="#7A9E6A" />
        <path d="M 0 300 C 150 260 300 280 420 250 C 560 220 700 260 800 240 L 800 300 L 0 300 Z" fill="#5E8456" />
        <rect x={520} y={150} width={180} height={160} fill="#E0B07E" />
        <path d="M 500 154 L 610 80 L 720 154 Z" fill="#9A4B3A" />
        <rect x={590} y={230} width={40} height={80} fill="#5B3A2A" />
        {/* two kids */}
        <g transform="translate(260 300)">
          <circle cx={0} cy={-120} r={30} fill="#E3B08E" />
          <path d="M -30 -132 C -30 -160 30 -160 30 -132 C 20 -146 -20 -146 -30 -132 Z" fill="#6B4630" />
          <path d="M -36 40 C -36 -40 -26 -86 0 -86 C 26 -86 36 -40 36 40 Z" fill="#D9774A" />
          <path d="M -24 40 L -24 120 M 24 40 L 24 120" stroke="#3E4F6B" strokeWidth={16} />
          <path d={`M 30 -70 L 60 ${-60 - wave} `} stroke="#E3B08E" strokeWidth={12} strokeLinecap="round" />
          <path d="M -30 -70 L -46 -10" stroke="#E3B08E" strokeWidth={12} strokeLinecap="round" />
        </g>
        <g transform="translate(380 330)">
          <circle cx={0} cy={-100} r={26} fill="#C99272" />
          <path d="M -28 -110 C -28 -140 28 -140 28 -110 L 28 -90 C 20 -110 -20 -110 -28 -90 Z" fill="#2B2220" />
          <path d="M -30 30 C -30 -40 -22 -70 0 -70 C 22 -70 30 -40 30 30 Z" fill="#43C5F5" />
          <path d="M -20 30 L -20 90 M 20 30 L 20 90" stroke="#2E4364" strokeWidth={14} />
        </g>
      </g>
      <rect width={800} height={600} fill={`url(#fg-${uid})`} opacity={0.35 * (1 - change) + 0.04} style={{mixBlendMode: 'overlay'}} />
      <rect width={800} height={600} fill="#fff" opacity={flick} />
      <path d={`M ${300 + ((t * 300) % 400)} 0 L ${304 + ((t * 300) % 400)} 600`} stroke="#fff" strokeWidth={2} opacity={0.4 * (1 - change)} />
    </svg>
  );
};

/** Front-facing illustrated bust (head + shoulders). viewBox -110 -110 220 260 */
export const Bust: React.FC<{look: PersonLook; smile: number; uid: string; shirt: string}> = ({look, smile, uid, shirt}) => (
  <svg viewBox="-110 -110 220 260" width="100%" height="100%" style={{overflow: 'visible', display: 'block'}}>
    <path d="M -100 150 C -100 110 -80 92 -20 86 L 20 86 C 80 92 100 110 100 150 Z" fill={shirt} />
    <path d="M -20 86 L 0 112 L 20 86 Z" fill="#000" opacity={0.15} />
    <FaceBase look={look} uid={uid} />
    <FaceExpression look={look} smile={smile} uid={uid} />
  </svg>
);
