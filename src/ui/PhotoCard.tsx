import React from 'react';
import {PhotoArt, PhotoArtProps} from '../art/PhotoArt';
import {C} from '../theme';
import {Chip} from './Type';

/** The illustrated vintage print: paper border, soft shadow, optional label. */
export const PhotoCard: React.FC<
  PhotoArtProps & {
    width: number;
    x: number;
    y: number;
    rot?: number;
    scale?: number;
    opacity?: number;
    label?: {text: string; variant: 'original' | 'edited' | 'memory' | 'plain'; opacity?: number};
    labelSize?: number;
    border?: boolean;
    glow?: string;
    glowAmount?: number;
    filter?: string;
    /** zoom into the artwork (camera inside the print) */
    zoom?: {scale: number; cx: number; cy: number};
  }
> = ({width, x, y, rot = 0, scale = 1, opacity = 1, label, labelSize, border = true, glow, glowAmount = 0, filter, zoom, ...art}) => {
  const h = width * 0.75;
  const pad = border ? width * 0.032 : 0;
  const ls = labelSize ?? Math.max(16, width * 0.024);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2 - pad,
        top: y - h / 2 - pad,
        width: width + pad * 2,
        height: h + pad * 2 + (border ? pad * 0.6 : 0),
        transform: `rotate(${rot}deg) scale(${scale})`,
        opacity,
        background: border ? C.photoBorder : 'transparent',
        borderRadius: border ? 4 : 0,
        padding: pad,
        boxShadow: `0 ${width * 0.04}px ${width * 0.09}px rgba(0,0,0,0.55)${
          glow && glowAmount > 0 ? `, 0 0 ${width * 0.08}px ${width * 0.01}px ${glow}` : ''
        }`,
        filter,
      }}
    >
      <div style={{width, height: h, overflow: 'hidden', position: 'relative', background: '#222'}}>
        <div
          style={{
            width,
            height: h,
            transformOrigin: zoom ? `${zoom.cx * 100}% ${zoom.cy * 100}%` : undefined,
            transform: zoom ? `scale(${zoom.scale})` : undefined,
          }}
        >
          <PhotoArt {...art} />
        </div>
      </div>
      {label ? (
        <div style={{position: 'absolute', left: pad + ls * 0.8, top: pad + ls * 0.8, opacity: label.opacity ?? 1}}>
          <Chip text={label.text} variant={label.variant} size={ls} />
        </div>
      ) : null}
    </div>
  );
};
