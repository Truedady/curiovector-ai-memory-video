import React from 'react';

export type HairStyle = 'long' | 'short' | 'bun' | 'curly' | 'bob' | 'gray';

export type PersonLook = {
  id: string;
  skin: string;
  skinShade: string;
  hair: string;
  hairStyle: HairStyle;
  lip: string;
  iris: string;
  lashes?: boolean;
};

export const WOMAN: PersonLook = {
  id: 'w',
  skin: '#EDBE9C',
  skinShade: '#C88C6B',
  hair: '#4B2B1E',
  hairStyle: 'long',
  lip: '#B5615A',
  iris: '#5A3A22',
  lashes: true,
};

export const MAN: PersonLook = {
  id: 'm',
  skin: '#D9A07C',
  skinShade: '#A96F52',
  hair: '#2A211E',
  hairStyle: 'short',
  lip: '#A0584E',
  iris: '#3D2A1E',
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const FACE_PATH =
  'M 0 -62 C 33 -62 50 -38 50 -4 C 50 30 32 60 0 64 C -32 60 -50 30 -50 -4 C -50 -38 -33 -62 0 -62 Z';

/** Hair drawn behind the head (long hair, bun, etc.). */
const HairBack: React.FC<{look: PersonLook}> = ({look}) => {
  const c = look.hair;
  switch (look.hairStyle) {
    case 'long':
      return (
        <path
          d="M -58 -20 C -66 -70 -28 -86 4 -84 C 46 -82 70 -56 62 -6 C 58 30 70 70 78 104 C 52 116 28 108 20 96 L -24 96 C -36 112 -66 114 -82 100 C -66 66 -54 30 -58 -20 Z"
          fill={c}
        />
      );
    case 'bob':
      return (
        <path
          d="M -58 -16 C -64 -70 -26 -84 2 -82 C 40 -82 66 -58 60 -14 C 58 18 62 40 58 54 C 44 60 30 56 24 50 L -26 50 C -34 58 -50 60 -62 54 C -56 34 -56 12 -58 -16 Z"
          fill={c}
        />
      );
    case 'bun':
      return <circle cx={8} cy={-74} r={24} fill={c} />;
    case 'curly':
      return (
        <g fill={c}>
          {Array.from({length: 11}).map((_, i) => {
            const a = Math.PI * (1.05 + (i / 10) * 0.9);
            return <circle key={i} cx={Math.cos(a) * 52} cy={Math.sin(a) * 58 - 4} r={20} />;
          })}
        </g>
      );
    default:
      return null;
  }
};

/** Hair on top of the head (fringe / crown). */
const HairFront: React.FC<{look: PersonLook}> = ({look}) => {
  const c = look.hair;
  switch (look.hairStyle) {
    case 'long':
      return (
        <g>
          <path
            d="M -52 -10 C -58 -56 -30 -76 4 -74 C 38 -72 58 -50 52 -12 C 46 -36 30 -50 10 -52 C 0 -40 -26 -30 -40 -30 C -46 -24 -48 -18 -52 -10 Z"
            fill={c}
          />
          <path d="M 8 -70 C 22 -64 34 -52 40 -36" stroke="#7A4A33" strokeWidth={2} fill="none" opacity={0.6} />
          <path d="M -6 -66 C -18 -56 -30 -44 -36 -34" stroke="#7A4A33" strokeWidth={2} fill="none" opacity={0.5} />
        </g>
      );
    case 'bob':
      return (
        <path
          d="M -54 -6 C -58 -56 -28 -76 2 -74 C 36 -72 58 -50 54 -8 C 48 -30 36 -42 22 -44 C 4 -42 -22 -40 -54 -6 Z"
          fill={c}
        />
      );
    case 'short':
      return (
        <g>
          <path
            d="M -52 -12 C -56 -58 -26 -78 6 -76 C 40 -74 58 -52 52 -14 C 48 -30 42 -38 34 -42 C 12 -34 -16 -44 -30 -40 C -42 -36 -48 -26 -52 -12 Z"
            fill={c}
          />
          <path d="M -22 -64 C -6 -70 20 -68 36 -54" stroke="#5a4a44" strokeWidth={2} fill="none" opacity={0.5} />
        </g>
      );
    case 'gray':
      return (
        <path
          d="M -52 -10 C -56 -54 -26 -74 4 -72 C 38 -70 58 -48 52 -10 C 46 -28 36 -36 26 -40 C 10 -44 -18 -46 -34 -38 C -44 -32 -50 -22 -52 -10 Z"
          fill={c}
        />
      );
    case 'bun':
      return (
        <path
          d="M -52 -8 C -56 -56 -28 -74 4 -72 C 38 -70 58 -50 52 -8 C 44 -40 20 -54 0 -52 C -22 -52 -44 -38 -52 -8 Z"
          fill={c}
        />
      );
    case 'curly':
      return (
        <g fill={c}>
          {Array.from({length: 7}).map((_, i) => (
            <circle key={i} cx={-42 + i * 14} cy={-56 + Math.abs(i - 3) * 5} r={15} />
          ))}
        </g>
      );
    default:
      return null;
  }
};

/** Head shape, ears, neck, nose and hair — everything except the expression. */
export const FaceBase: React.FC<{look: PersonLook; uid: string}> = ({look, uid}) => {
  const gid = `skin-${uid}`;
  return (
    <g>
      <defs>
        <radialGradient id={gid} cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor={look.skin} />
          <stop offset="65%" stopColor={look.skin} />
          <stop offset="100%" stopColor={look.skinShade} />
        </radialGradient>
      </defs>
      <HairBack look={look} />
      {/* neck */}
      <path d="M -19 40 L -19 88 Q 0 98 19 88 L 19 40 Z" fill={look.skinShade} />
      <path d="M -19 56 Q 0 74 19 56 L 19 46 L -19 46 Z" fill="#000" opacity={0.12} />
      {/* ears */}
      <ellipse cx={-49} cy={2} rx={9} ry={15} fill={look.skinShade} />
      <ellipse cx={49} cy={2} rx={9} ry={15} fill={look.skinShade} />
      <path d={FACE_PATH} fill={`url(#${gid})`} />
      {/* jaw shading */}
      <path d="M 30 26 C 26 48 14 60 0 64 C 22 62 44 40 48 6 Z" fill="#000" opacity={0.08} />
      {/* nose */}
      <path d="M 2 -6 C 4 6 8 14 9 18" stroke={look.skinShade} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.75} />
      <path d="M -7 20 Q 0 24 8 20" stroke={look.skinShade} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <ellipse cx={-3} cy={10} rx={3} ry={6} fill="#fff" opacity={0.18} />
      <HairFront look={look} />
    </g>
  );
};

/**
 * Eyes, brows, cheeks and mouth. `smile` 0 = neutral, 1 = full smile.
 * Only this group changes between the original and the AI-edited photograph.
 */
export const FaceExpression: React.FC<{look: PersonLook; smile: number; uid: string}> = ({look, smile: s, uid}) => {
  const w = lerp(14, 19, s);
  const yc = lerp(34, 30, s);
  const upper = lerp(32.6, 33.4, s);
  const lower = lerp(36.2, 51, s);
  const mouth = `M ${-w} ${yc} Q 0 ${upper} ${w} ${yc} Q 0 ${lower} ${-w} ${yc} Z`;
  const clip = `mouth-${uid}`;
  const lowLid = lerp(5.5, 1.2, s);
  const eye = (x: number, flip: number) => {
    const ew = 10.5;
    const almond = `M ${-ew} 0 Q 0 -8.5 ${ew} 0 Q 0 ${lowLid + 1.5} ${-ew} 0 Z`;
    const eclip = `eye-${uid}-${flip}`;
    return (
      <g transform={`translate(${x} -6)`}>
        <defs>
          <clipPath id={eclip}>
            <path d={almond} />
          </clipPath>
        </defs>
        <path d={almond} fill="#F7F1EA" />
        <g clipPath={`url(#${eclip})`}>
          <circle cx={0} cy={-1} r={6} fill={look.iris} />
          <circle cx={0} cy={-1} r={3} fill="#120a06" />
          <circle cx={1.8} cy={-3} r={1.5} fill="#fff" opacity={0.9} />
        </g>
        {/* upper lid */}
        <path
          d={`M ${-ew - 1} 0.5 Q 0 -9.5 ${ew + 1} 0.5`}
          stroke="#2a1812"
          strokeWidth={look.lashes ? 2.6 : 2}
          fill="none"
          strokeLinecap="round"
        />
        {look.lashes ? (
          <path d={`M ${flip * (ew + 1)} 0.5 l ${flip * 4} -3`} stroke="#2a1812" strokeWidth={1.8} strokeLinecap="round" />
        ) : null}
        {/* lower lid / smile crease */}
        <path
          d={`M ${-ew + 1} 1 Q 0 ${lowLid + 3} ${ew - 1} 1`}
          stroke={look.skinShade}
          strokeWidth={1.4}
          fill="none"
          opacity={0.5 + 0.4 * s}
        />
        <path
          d={`M ${-ew + 2} ${6 + 2 * (1 - s)} Q 0 ${10 + 2 * (1 - s)} ${ew - 2} ${6 + 2 * (1 - s)}`}
          stroke={look.skinShade}
          strokeWidth={1.3}
          fill="none"
          opacity={0.55 * s}
        />
      </g>
    );
  };
  const browY = lerp(-21, -23, s);
  return (
    <g>
      {/* cheeks rise with the smile */}
      <ellipse cx={-27} cy={lerp(20, 13, s)} rx={11} ry={7} fill="#E07B6A" opacity={0.12 + 0.18 * s} />
      <ellipse cx={27} cy={lerp(20, 13, s)} rx={11} ry={7} fill="#E07B6A" opacity={0.12 + 0.18 * s} />
      {eye(-19, -1)}
      {eye(19, 1)}
      <path d={`M -29 ${browY + 2} Q -19 ${browY - 4} -9 ${browY}`} stroke={look.hair} strokeWidth={3.6} fill="none" strokeLinecap="round" />
      <path d={`M 9 ${browY} Q 19 ${browY - 4} 29 ${browY + 2}`} stroke={look.hair} strokeWidth={3.6} fill="none" strokeLinecap="round" />
      {/* smile lines */}
      <path
        d={`M -14 16 Q ${-w - 6} ${yc - 2} ${-w - 3} ${yc + 8}`}
        stroke={look.skinShade}
        strokeWidth={1.6}
        fill="none"
        opacity={0.6 * s}
        strokeLinecap="round"
      />
      <path
        d={`M 14 16 Q ${w + 6} ${yc - 2} ${w + 3} ${yc + 8}`}
        stroke={look.skinShade}
        strokeWidth={1.6}
        fill="none"
        opacity={0.6 * s}
        strokeLinecap="round"
      />
      {/* lower lip volume */}
      <path
        d={`M ${-w + 3} ${yc + 2.5} Q 0 ${lerp(41, 55, s)} ${w - 3} ${yc + 2.5}`}
        stroke={look.lip}
        strokeWidth={lerp(4, 3, s)}
        fill="none"
        strokeLinecap="round"
        opacity={0.75}
      />
      <defs>
        <clipPath id={clip}>
          <path d={mouth} />
        </clipPath>
      </defs>
      <path d={mouth} fill="#5E2324" stroke={look.lip} strokeWidth={1.8} strokeLinejoin="round" />
      <g clipPath={`url(#${clip})`} opacity={Math.min(1, s * 1.6)}>
        <rect x={-30} y={yc - 6} width={60} height={upper - yc + 10.5} fill="#FBF6EE" />
        <path d={`M -30 ${lower - 6} Q 0 ${lower - 14} 30 ${lower - 6} L 30 70 L -30 70 Z`} fill="#B5545A" opacity={0.7} />
      </g>
      {/* upper lip tint */}
      <path
        d={`M ${-w} ${yc} Q ${-w / 2} ${upper - 4} 0 ${upper - 2} Q ${w / 2} ${upper - 4} ${w} ${yc}`}
        stroke={look.lip}
        strokeWidth={2.2}
        fill="none"
        opacity={0.55}
        strokeLinecap="round"
      />
    </g>
  );
};
