import React from 'react';
import {AbsoluteFill} from 'remotion';
import {easeOut, fadeWin, lerp, prog} from '../anim';
import {PhotoArt} from '../art/PhotoArt';
import {Thinker} from '../art/Figures';
import {FaceCrop} from '../ui/FaceCrop';
import {PhotoCard} from '../ui/PhotoCard';
import {Chip, Kicker} from '../ui/Type';
import {C, FONT_TEXT} from '../theme';
import {At, photoPt, SceneProps, useLayout} from './common';

/* ───────────────────────── SCENE 1 — THE SMILE THAT NEVER HAPPENED ───────────────────────── */
export const HookScene: React.FC<SceneProps> = ({t}) => {
  const {W, H, P} = useLayout();
  const smile = 1 - prog(t, 0.82, 1.55);
  const heroOut = prog(t, 1.95, 2.55);
  // Full-bleed close-up: the photograph fills the frame, focused on the faces.
  const s = (P ? 3.25 : 3.5) - 0.3 * prog(t, 0, 2.0, (x) => x) + 0.6 * heroOut;
  const fx = 404;
  const fy = P ? 300 : 236;
  const split = prog(t, 2.05, 2.85, easeOut);
  const cardW = P ? 820 : 800;
  const drift = prog(t, 2.6, 4.84, (x) => x);
  const editedGlow = prog(t, 3.2, 4.0);
  return (
    <AbsoluteFill>
      {heroOut < 1 ? (
        <AbsoluteFill style={{opacity: 1 - heroOut, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: W / 2 - fx * s, top: H / 2 - fy * s, width: 800 * s, height: 600 * s}}>
            <PhotoArt
              uid="hook"
              smileA={smile}
              smileB={smile}
              sweep={fadeWin(t, 0.72, 1.75, 0.15, 0.3)}
              sweepPos={prog(t, 0.72, 1.7, (x) => x)}
            />
          </div>
          {/* flash as the print is pulled away */}
          <AbsoluteFill style={{background: C.white, opacity: 0.5 * fadeWin(t, 1.95, 2.5, 0.12, 0.4)}} />
        </AbsoluteFill>
      ) : null}
      {split > 0 ? (
        <>
          <PhotoCard
            uid="hookA"
            width={cardW}
            x={P ? W / 2 : lerp(-500, 515, split)}
            y={P ? lerp(-400, 575, split) : 545}
            rot={-1.6}
            scale={1 + 0.025 * drift}
            smileA={0}
            smileB={0}
            label={{text: 'Original', variant: 'original', opacity: prog(t, 2.7, 3.0)}}
            labelSize={P ? 30 : 26}
          />
          <PhotoCard
            uid="hookB"
            width={cardW}
            x={P ? W / 2 : lerp(W + 500, 1405, split)}
            y={P ? lerp(H + 400, 1305, split) : 545}
            rot={1.6}
            scale={1 + 0.025 * drift}
            smileA={1}
            smileB={1}
            glow="rgba(255,146,62,0.55)"
            glowAmount={editedGlow}
            label={{text: 'AI-Edited', variant: 'edited', opacity: prog(t, 2.85, 3.15)}}
            labelSize={P ? 30 : 26}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* ───────────────────────── SCENE 2 — ONE SMALL AI EDIT ───────────────────────── */
const Bracket: React.FC<{x1: number; y1: number; x2: number; y2: number; o: number; color?: string}> = ({x1, y1, x2, y2, o, color = C.cyan}) => {
  const L = 34;
  const st: React.CSSProperties = {position: 'absolute', width: L, height: L, borderColor: color, borderStyle: 'solid', borderWidth: 0, opacity: o};
  return (
    <>
      <div style={{...st, left: x1, top: y1, borderLeftWidth: 4, borderTopWidth: 4}} />
      <div style={{...st, left: x2 - L, top: y1, borderRightWidth: 4, borderTopWidth: 4}} />
      <div style={{...st, left: x1, top: y2 - L, borderLeftWidth: 4, borderBottomWidth: 4}} />
      <div style={{...st, left: x2 - L, top: y2 - L, borderRightWidth: 4, borderBottomWidth: 4}} />
    </>
  );
};

const LAYERS = ['Sky', 'Lighthouse', 'Clothing', 'Faces', 'Expression'];

const Panel: React.FC<{x: number; y: number; w: number; h: number; o: number; children: React.ReactNode}> = ({x, y, w, h, o, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      opacity: o,
      borderRadius: 18,
      background: 'linear-gradient(180deg, rgba(17,36,86,0.55), rgba(8,19,47,0.55))',
      border: '1.5px solid rgba(67,197,245,0.28)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      padding: 26,
      boxSizing: 'border-box',
      fontFamily: FONT_TEXT,
      color: C.white,
    }}
  >
    {children}
  </div>
);

export const EditScene: React.FC<SceneProps> = ({t}) => {
  const {W, P} = useLayout();
  const cw = 1000;
  const cx = P ? W / 2 : 960;
  const cy = P ? 870 : 548;
  const intro = prog(t, 4.84, 5.7, easeOut);
  const smile = prog(t, 14.3, 15.35);
  const zoomIn = prog(t, 9.9, 12.6);
  const zoomOut = prog(t, 15.7, 17.2);
  const zoom = 1 + (P ? 0.55 : 0.42) * (zoomIn - zoomOut);
  const faces = photoPt(cx, cy, cw, 404, 236);
  const trace = prog(t, 10.1, 11.7) * (1 - prog(t, 15.8, 16.5));
  const edited = prog(t, 15.95, 16.25);
  const chrome = intro * (1 - 0.55 * (zoomIn - zoomOut));
  const exprActive = prog(t, 10.8, 11.2);
  const exprOrange = prog(t, 14.2, 14.6);
  const boxA = [photoPt(cx, cy, cw, 196, 140), photoPt(cx, cy, cw, 440, 600)];
  const boxB = [photoPt(cx, cy, cw, 382, 120), photoPt(cx, cy, cw, 622, 600)];
  const boxO = (d: number) => fadeWin(t, 6.5 + d, 9.3, 0.35, 0.5);

  const layerList = (
    <div style={{display: 'flex', flexDirection: P ? 'row' : 'column', gap: P ? 12 : 14, flexWrap: 'wrap'}}>
      {LAYERS.map((l, i) => {
        const isExpr = i === 4;
        const col = isExpr ? (exprOrange > 0.5 ? C.orange : exprActive > 0.5 ? C.cyan : C.muted) : C.muted;
        const bg = isExpr ? `rgba(${exprOrange > 0.5 ? '255,146,62' : '67,197,245'},${0.18 * exprActive})` : 'rgba(248,250,255,0.04)';
        return (
          <div
            key={l}
            style={{
              padding: P ? '12px 18px' : '14px 18px',
              borderRadius: 10,
              background: bg,
              border: `1.5px solid ${isExpr && exprActive > 0.5 ? col : 'rgba(248,250,255,0.1)'}`,
              color: isExpr && exprActive > 0.5 ? col : 'rgba(248,250,255,0.75)',
              fontSize: P ? 26 : 24,
              fontWeight: 600,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{width: 12, height: 12, borderRadius: 3, background: col, opacity: 0.8}} />
            {l}
          </div>
        );
      })}
    </div>
  );

  const slider = (
    <div style={{width: '100%'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: P ? 28 : 24, fontWeight: 600, letterSpacing: '0.12em', marginBottom: 16}}>
        <span style={{color: C.muted}}>SMILE</span>
        <span style={{color: smile > 0.02 ? C.orange : C.white}}>{Math.round(smile * 100)}%</span>
      </div>
      <div style={{position: 'relative', height: 10, borderRadius: 5, background: 'rgba(248,250,255,0.14)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${smile * 100}%`, borderRadius: 5, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`}} />
        <div
          style={{
            position: 'absolute',
            left: `calc(${smile * 100}% - 14px)`,
            top: -9,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: C.white,
            boxShadow: `0 0 ${10 + 20 * smile}px ${C.orange}`,
          }}
        />
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      {/* top tool bar */}
      <div style={{position: 'absolute', left: 0, right: 0, top: P ? 250 : 58, display: 'flex', justifyContent: 'center', opacity: chrome}}>
        <div style={{display: 'flex', gap: 22, alignItems: 'center', padding: '12px 26px', borderRadius: 40, border: '1.5px solid rgba(67,197,245,0.25)', background: 'rgba(8,19,47,0.6)'}}>
          {['crop', 'brush', 'face', 'light'].map((k, i) => (
            <div key={k} style={{width: 34, height: 34, borderRadius: 8, border: `2px solid ${i === 2 && exprActive > 0.5 ? C.cyan : 'rgba(248,250,255,0.35)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: i === 2 ? 14 : 10, height: i === 2 ? 14 : 10, borderRadius: i === 2 ? 7 : 2, background: i === 2 && exprActive > 0.5 ? C.cyan : 'rgba(248,250,255,0.35)'}} />
            </div>
          ))}
          <div style={{width: 1.5, height: 30, background: 'rgba(248,250,255,0.2)'}} />
          <div style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: 22, letterSpacing: '0.18em', color: exprOrange > 0.5 ? C.orange : C.cyan}}>AI EDIT</div>
        </div>
      </div>
      {!P ? (
        <>
          <Panel x={70} y={200} w={300} h={560} o={chrome}>
            <Kicker size={20} color={C.muted} style={{marginBottom: 22}}>Layers</Kicker>
            {layerList}
          </Panel>
          <Panel x={1550} y={200} w={300} h={300} o={chrome}>
            <Kicker size={20} color={C.muted} style={{marginBottom: 30}}>Expression</Kicker>
            {slider}
          </Panel>
        </>
      ) : (
        <Panel x={70} y={1320} w={W - 140} h={300} o={chrome}>
          {layerList}
          <div style={{height: 34}} />
          {slider}
        </Panel>
      )}
      <AbsoluteFill style={{transformOrigin: `${faces.x}px ${faces.y}px`, transform: `scale(${zoom})`}}>
        <PhotoCard
          uid="edit"
          width={cw}
          x={cx}
          y={cy}
          scale={1.06 - 0.06 * intro}
          smileA={smile}
          smileB={smile}
          trace={trace}
          sweep={fadeWin(t, 14.15, 15.5, 0.2, 0.4)}
          sweepPos={prog(t, 14.15, 15.45, (x) => x)}
          glow="rgba(255,146,62,0.5)"
          glowAmount={edited}
          label={edited > 0.5 ? {text: 'AI-Edited', variant: 'edited'} : {text: 'Original', variant: 'original', opacity: intro}}
          labelSize={P ? 30 : 26}
        />
        <Bracket x1={boxA[0].x} y1={boxA[0].y} x2={boxA[1].x} y2={boxA[1].y - 20} o={boxO(0)} />
        <Bracket x1={boxB[0].x} y1={boxB[0].y} x2={boxB[1].x} y2={boxB[1].y - 20} o={boxO(0.35)} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: P ? 380 : 965, display: 'flex', justifyContent: 'center', opacity: fadeWin(t, 11.2, 14.1, 0.4, 0.4)}}>
        <Chip text="One detail · Expression" variant="memory" size={P ? 34 : 28} style={{background: C.navy}} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────────────────────── SCENE 3 — THE MEMORY QUESTION ───────────────────────── */
export const QuestionScene: React.FC<SceneProps> = ({t}) => {
  const {W, H, P} = useLayout();
  const fly = prog(t, 18.11, 19.2);
  const burst = prog(t, 19.0, 20.0, easeOut);
  const crops = prog(t, 19.5, 20.3, easeOut);
  const push = prog(t, 18.11, 21.49, (x) => x);
  // memory space in front of the forehead
  const mx = P ? W / 2 : 1230;
  const my = P ? 680 : 500;
  const startX = P ? W / 2 : 960;
  const startY = P ? 870 : 548;
  const cardW = lerp(1000, P ? 720 : 640, fly);
  const spread = 70 * burst;
  const pulse = Math.sin((t - 19.5) * 4.2);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.05 * push})`}}>
      {/* the person trying to remember */}
      <div
        style={{
          position: 'absolute',
          left: P ? W / 2 - 330 : 70,
          top: P ? H - 760 : 300,
          width: P ? 620 : 680,
          height: P ? 674 : 740,
          opacity: prog(t, 18.11, 18.9),
          transform: `translateX(${(1 - prog(t, 18.11, 19.2, easeOut)) * -60}px)`,
        }}
      >
        <Thinker uid="q" glow={0.5 + 0.4 * crops} />
      </div>
      {/* the photograph drifts into the dark and comes apart */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - prog(t, 19.9, 20.6)}}>
        <PhotoCard
          uid="qcard"
          width={cardW}
          x={lerp(startX, mx, fly)}
          y={lerp(startY, my, fly)}
          rot={-3 * fly}
          smileA={1}
          smileB={1}
          border={burst < 0.05}
          layers={{
            sky: {x: -spread * 0.8, y: -spread * 0.6, rot: -4 * burst, opacity: 1 - 0.5 * burst},
            place: {x: spread * 1.1, y: -spread * 0.2, rot: 3 * burst, opacity: 1 - 0.4 * burst},
            clothing: {x: 0, y: spread * 0.9, rot: -2 * burst, opacity: 1 - 0.5 * burst},
            faces: {y: -spread * 0.2, scale: 1 + 0.05 * burst},
            expressions: {y: -spread * 0.2, scale: 1 + 0.05 * burst},
          }}
        />
      </div>
      {crops > 0 ? (
        <>
          <FaceCrop
            uid="qa"
            size={P ? 400 : 380}
            smile={0}
            x={P ? W / 2 - 230 : mx - 220}
            y={P ? my + 10 : my}
            ring={C.cyan}
            opacity={crops * (0.75 + 0.25 * pulse)}
            scale={(0.6 + 0.4 * crops) * (1 + 0.05 * pulse)}
          />
          <FaceCrop
            uid="qb"
            size={P ? 400 : 380}
            smile={1}
            x={P ? W / 2 + 230 : mx + 220}
            y={P ? my + 10 : my}
            ring={C.orange}
            opacity={crops * (0.75 - 0.25 * pulse)}
            scale={(0.6 + 0.4 * crops) * (1 - 0.05 * pulse)}
          />
          <At x={P ? W / 2 - 230 : mx - 220} y={my + (P ? 250 : 235)} o={crops}>
            <Chip text="Original?" variant="original" size={P ? 30 : 26} />
          </At>
          <At x={P ? W / 2 + 230 : mx + 220} y={my + (P ? 250 : 235)} o={crops}>
            <Chip text="Edited?" variant="edited" size={P ? 30 : 26} />
          </At>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
