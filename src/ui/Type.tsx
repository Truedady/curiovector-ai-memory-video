import React from 'react';
import {C, FONT_DISPLAY, FONT_TEXT} from '../theme';

export const Headline: React.FC<{
  size: number;
  color?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  weight?: number;
}> = ({size, color = C.white, children, style, weight = 800}) => (
  <div
    style={{
      fontFamily: FONT_DISPLAY,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: '-0.015em',
      color,
      textTransform: 'uppercase',
      textShadow: '0 6px 40px rgba(4,10,28,0.7)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kicker: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  size,
  color = C.cyan,
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_TEXT,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  text: string;
  variant: 'original' | 'edited' | 'memory' | 'plain';
  size: number;
  style?: React.CSSProperties;
}> = ({text, variant, size, style}) => {
  const v = {
    original: {bg: 'rgba(8,19,47,0.88)', fg: C.white, border: C.cyan},
    edited: {bg: C.orange, fg: C.navy, border: C.orange},
    memory: {bg: 'rgba(8,19,47,0.9)', fg: C.cyan, border: C.cyan},
    plain: {bg: 'rgba(248,250,255,0.08)', fg: C.white, border: 'rgba(248,250,255,0.35)'},
  }[variant];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.5,
        padding: `${size * 0.42}px ${size * 0.85}px`,
        borderRadius: size * 0.35,
        background: v.bg,
        color: v.fg,
        border: `${Math.max(1.5, size * 0.09)}px solid ${v.border}`,
        fontFamily: FONT_TEXT,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        boxShadow: variant === 'edited' ? '0 0 30px rgba(255,146,62,0.45)' : '0 6px 24px rgba(0,0,0,0.35)',
        ...style,
      }}
    >
      {variant === 'edited' ? <Sparkle size={size * 0.95} color={C.navy} /> : null}
      {text}
    </div>
  );
};

export const Sparkle: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20">
    <path d="M 0 -9 C 1 -3 3 -1 9 0 C 3 1 1 3 0 9 C -1 3 -3 1 -9 0 C -3 -1 -1 -3 0 -9 Z" fill={color} />
  </svg>
);

export const Footnote: React.FC<{size: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  size,
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_TEXT,
      fontWeight: 500,
      fontSize: size,
      color: C.muted,
      letterSpacing: '0.02em',
      ...style,
    }}
  >
    {children}
  </div>
);
