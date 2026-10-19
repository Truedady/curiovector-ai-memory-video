import React from 'react';
import {AbsoluteFill} from 'remotion';
import {easeInOut, easeOut, fadeWin, lerp, prog} from '../anim';
import {PersonLook} from '../art/Face';
import {Album, Bust, FilmFrame, Vacation} from '../art/Keepsakes';
import {C} from '../theme';
import {PhotoCard} from '../ui/PhotoCard';
import {Chip, Headline, Kicker} from '../ui/Type';
import {At, photoPt, SceneProps, useLayout} from './common';

/* ───────────────────────── SCENE 7 — THE CONSEQUENCES ───────────────────────── */
const Framed: React.FC<{w: number; x: number; y: number; children: React.ReactNode; glow?: number; aspect?: number}> = ({w, x, y, children, glow = 0, aspect = 0.75}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - (w * aspect) / 2,
      width: w,
      height: w * aspect,
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 ${60 * glow}px rgba(67,197,245,${0.6 * glow})`,
      border: `2px solid rgba(248,250,255,0.15)`,
    }}
  >
    {children}
  </div>
);

export const ConsequencesScene: React.FC<SceneProps> = ({t}) => {
  const {W, H, P} = useLayout();
  const step = P ? 1300 : 1750;
  const cam =
    lerp(-step * 0.6, 0, prog(t, 82.3, 84.8, easeOut)) +
    step * prog(t, 85.95, 86.75, easeInOut) +
    step * prog(t, 87.45, 88.35, easeInOut);
  const pos = (i: number) => (P ? {x: W / 2, y: H / 2 - 40 + i * step - cam} : {x: W / 2 + i * step - cam, y: H / 2 - 20});
  const aO = 1 - prog(t, 90.7, 91.3);
  const candle = prog(t, 85.2, 85.9);
  const sky = prog(t, 86.8, 87.5);
  const restore = prog(t, 88.6, 89.9);
  const iw = P ? 960 : 1180;
  const captionDy = P ? iw * 0.375 + 70 : iw * 0.375 + 58;

  /* Part B — a tiny change (91.3 → 93.8) */
  const bO = fadeWin(t, 91.0, 94.1, 0.45, 0.4);
  /* Part C — remembered as the original (93.88 → 99.4) */
  const cO = fadeWin(t, 93.8, 99.75, 0.4, 0.45);
  const swap = prog(t, 94.6, 96.2);
  const alarm = fadeWin(t, 97.2, 99.4, 0.3, 0.6);
  /* Part D — drifting apart (99.6 → 104.2) */
  const dO = prog(t, 99.5, 100.0);
  const drift = prog(t, 99.8, 102.6, easeInOut);

  const slot = P ? {x: W / 2, y: 650} : {x: 560, y: 560};
  const other = P ? {x: W / 2, y: 1330} : {x: 1370, y: 560};
  const cw = P ? 780 : 720;

  return (
    <AbsoluteFill>
      {aO > 0 ? (
        <AbsoluteFill style={{opacity: aO}}>
          {/* a continuous light rail connecting the keepsakes */}
          <div
            style={{
              position: 'absolute',
              ...(P ? {left: W / 2 - 1, top: 0, bottom: 0, width: 2} : {top: H / 2 - 20, left: 0, right: 0, height: 2}),
              background: 'linear-gradient(90deg, rgba(67,197,245,0), rgba(67,197,245,0.35), rgba(67,197,245,0))',
            }}
          />
          {(() => {
            const p = pos(0);
            return (
              <>
                <div style={{position: 'absolute', left: p.x - iw * 0.55, top: p.y - iw * 0.55 * 0.622, width: iw * 1.1, height: iw * 1.1 * 0.622}}>
                  <Album uid="alb" change={candle} highlight={fadeWin(t, 84.9, 86.6, 0.3, 0.4)} />
                </div>
                <At x={p.x} y={p.y + iw * 0.36 + 40}>
                  <Kicker size={P ? 32 : 28}>Family photos</Kicker>
                </At>
              </>
            );
          })()}
          {(() => {
            const p = pos(1);
            return (
              <>
                <Framed w={iw} x={p.x} y={p.y} glow={fadeWin(t, 86.6, 88.0, 0.3, 0.4)}>
                  <Vacation uid="vac" change={sky} />
                  {/* video chrome */}
                  <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, height: 6, borderRadius: 3, background: 'rgba(248,250,255,0.3)'}}>
                    <div style={{width: `${30 + 40 * prog(t, 85.5, 88.5, (x) => x)}%`, height: 6, borderRadius: 3, background: C.cyan}} />
                  </div>
                  <div style={{position: 'absolute', left: 30, top: 26}}>
                    <Chip text="▶ Video" variant="plain" size={P ? 24 : 22} />
                  </div>
                </Framed>
                <At x={p.x} y={p.y + captionDy}>
                  <Kicker size={P ? 32 : 28}>Vacation videos</Kicker>
                </At>
              </>
            );
          })()}
          {(() => {
            const p = pos(2);
            return (
              <>
                <Framed w={iw} x={p.x} y={p.y} glow={fadeWin(t, 88.4, 90.8, 0.3, 0.4)}>
                  <FilmFrame uid="film" change={restore} t={t} />
                  <div style={{position: 'absolute', left: 30, top: 26, opacity: prog(t, 89.4, 89.9)}}>
                    <Chip text="AI-Restored" variant="edited" size={P ? 24 : 22} />
                  </div>
                </Framed>
                {/* sprocket holes */}
                {[-1, 1].map((sd) => (
                  <div key={sd} style={{position: 'absolute', left: p.x - iw / 2 - 10, width: iw + 20, top: p.y + sd * (iw * 0.375 + 24) - 8, height: 16, display: 'flex', justifyContent: 'space-between', opacity: 0.4}}>
                    {Array.from({length: 18}).map((_, i) => (
                      <div key={i} style={{width: 22, height: 14, borderRadius: 3, background: C.white}} />
                    ))}
                  </div>
                ))}
                <At x={p.x} y={p.y + captionDy + 20}>
                  <Kicker size={P ? 32 : 28}>Old memories, brought back</Kicker>
                </At>
              </>
            );
          })()}
        </AbsoluteFill>
      ) : null}

      {bO > 0 ? (
        <AbsoluteFill style={{opacity: bO}}>
          {(() => {
            const w = P ? 1000 : 900;
            const y = P ? 940 : 540;
            const m = photoPt(W / 2, y, w, 490, 248);
            const ring = prog(t, 91.9, 92.5, easeOut);
            return (
              <>
                <PhotoCard uid="tiny" width={w} x={W / 2} y={y} scale={1 + 0.03 * prog(t, 91, 94, (x) => x)} smileA={1} smileB={1} label={{text: 'AI-Edited', variant: 'edited'}} labelSize={P ? 28 : 24} />
                <div
                  style={{
                    position: 'absolute',
                    left: m.x - 60,
                    top: m.y - 60,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    border: `3px solid ${C.cyan}`,
                    boxShadow: `0 0 30px ${C.cyan}`,
                    opacity: ring,
                    transform: `scale(${1.4 - 0.4 * ring})`,
                  }}
                />
              </>
            );
          })()}
        </AbsoluteFill>
      ) : null}

      {cO > 0 ? (
        <AbsoluteFill style={{opacity: cO}}>
          {/* the slot in your mind labelled ORIGINAL */}
          <div
            style={{
              position: 'absolute',
              left: slot.x - cw / 2 - 40,
              top: slot.y - cw * 0.375 - 40,
              width: cw + 80,
              height: cw * 0.75 + 80,
              borderRadius: 26,
              border: `3px dashed ${alarm > 0.1 ? C.orange : C.cyan}`,
              boxShadow: `0 0 ${40 + 40 * alarm}px rgba(${alarm > 0.1 ? '255,146,62' : '67,197,245'},${0.25 + 0.3 * alarm})`,
            }}
          />
          <At x={slot.x} y={slot.y - cw * 0.375 - 40}>
            <Chip text="Remembered as original" variant="memory" size={P ? 28 : 24} />
          </At>
          <PhotoCard
            uid="swapA"
            width={cw}
            x={lerp(slot.x, other.x, swap)}
            y={lerp(slot.y, other.y, swap)}
            rot={-3 * swap}
            scale={1 - 0.12 * swap}
            opacity={1 - 0.7 * swap}
            filter={`saturate(${1 - 0.6 * swap})`}
            smileA={0}
            smileB={0}
          />
          <PhotoCard
            uid="swapB"
            width={cw}
            x={lerp(other.x, slot.x, swap)}
            y={lerp(other.y, slot.y, swap)}
            rot={lerp(3, 0, swap)}
            smileA={1}
            smileB={1}
            label={{text: 'AI-Edited', variant: 'edited', opacity: 1 - prog(t, 96.0, 96.6)}}
            labelSize={P ? 26 : 22}
            glow="rgba(255,146,62,0.6)"
            glowAmount={alarm}
          />
        </AbsoluteFill>
      ) : null}

      {dO > 0 ? (
        <AbsoluteFill style={{opacity: dO}}>
          {(() => {
            const d = lerp(P ? 40 : 60, P ? 360 : 545, drift);
            const w = P ? 800 : 680;
            const a = P ? {x: W / 2, y: H / 2 - 40 - d} : {x: W / 2 - d, y: H / 2};
            const b = P ? {x: W / 2, y: H / 2 - 40 + d} : {x: W / 2 + d, y: H / 2};
            return (
              <>
                <div
                  style={{
                    position: 'absolute',
                    ...(P
                      ? {left: W / 2 - 1, top: a.y, height: b.y - a.y, width: 0, borderLeft: `3px dashed rgba(248,250,255,0.4)`}
                      : {top: H / 2, left: a.x, width: b.x - a.x, height: 0, borderTop: `3px dashed rgba(248,250,255,0.4)`}),
                  }}
                />
                <PhotoCard uid="driftA" width={w} x={a.x} y={a.y} rot={-2 * drift} smileA={0} smileB={0} label={{text: 'Real event', variant: 'original'}} labelSize={P ? 26 : 22} />
                <PhotoCard
                  uid="driftB"
                  width={w}
                  x={b.x}
                  y={b.y}
                  rot={2 * drift}
                  smileA={1}
                  smileB={1}
                  label={{text: 'Your memory', variant: 'memory'}}
                  labelSize={P ? 26 : 22}
                  glow="rgba(67,197,245,0.55)"
                  glowAmount={0.4 + 0.6 * drift}
                  filter={`saturate(${1 - 0.25 * drift}) brightness(${1 + 0.05 * drift})`}
                />
              </>
            );
          })()}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* ───────────────────────── SCENE 8 — SCIENTIFIC QUALIFICATION ───────────────────────── */
const CROWD: {look: PersonLook; shirt: string; outcome: number}[] = [
  {look: {id: 'c1', skin: '#F0C9A8', skinShade: '#C99270', hair: '#8A5A34', hairStyle: 'bob', lip: '#B5615A', iris: '#3F5B6A', lashes: true}, shirt: '#3E6E8E', outcome: 0},
  {look: {id: 'c2', skin: '#8D5B3E', skinShade: '#6A412B', hair: '#1E1612', hairStyle: 'short', lip: '#7A3E36', iris: '#2A1A10'}, shirt: '#D2913F', outcome: 0},
  {look: {id: 'c3', skin: '#E6B48F', skinShade: '#BF8763', hair: '#E8E2D8', hairStyle: 'gray', lip: '#A8605A', iris: '#4A5A6A'}, shirt: '#5E7D5A', outcome: 1},
  {look: {id: 'c4', skin: '#C68B62', skinShade: '#9C6644', hair: '#2A1A14', hairStyle: 'curly', lip: '#9A4E46', iris: '#2A1A10', lashes: true}, shirt: '#8E4A5A', outcome: 0},
  {look: {id: 'c5', skin: '#F3D0B4', skinShade: '#CFA080', hair: '#C9A15E', hairStyle: 'bun', lip: '#C0706A', iris: '#4E6B4A', lashes: true}, shirt: '#2E4364', outcome: 0.45},
  {look: {id: 'c6', skin: '#A86E4A', skinShade: '#7F4E32', hair: '#2B2220', hairStyle: 'short', lip: '#8A4A40', iris: '#2A1A10'}, shirt: '#6B5A8E', outcome: 0},
];

export const QualificationScene: React.FC<SceneProps> = ({t}) => {
  const {W, P} = useLayout();
  const h1 = fadeWin(t, 104.2, 107.45, 0.4, 0.35);
  const h2 = prog(t, 107.5, 108.0);
  return (
    <AbsoluteFill>
      <At x={W / 2} y={P ? 290 : 130} o={h1} s={0.95 + 0.05 * prog(t, 104.2, 104.8, easeOut)}>
        <Headline size={P ? 92 : 86} style={{width: P ? 940 : 1700}}>
          Not mind control
        </Headline>
      </At>
      <At x={W / 2} y={P ? 290 : 130} o={h2} s={0.95 + 0.05 * h2}>
        <Headline size={P ? 70 : 76} style={{width: P ? 940 : 1800}}>
          A higher risk <span style={{color: C.cyan}}>—</span> not a certainty
        </Headline>
      </At>
      {CROWD.map((c, i) => {
        const col = i % (P ? 2 : 6);
        const row = P ? Math.floor(i / 2) : 0;
        const bx = P ? [290, 790][col] : 210 + i * 300;
        const by = P ? 760 + row * 390 : 800;
        const cy = P ? by - 252 : 455;
        const bw = P ? 210 : 250;
        const cardW = P ? 270 : 270;
        const appear = prog(t, 104.25 + i * 0.12, 104.85 + i * 0.12, easeOut);
        const thought = prog(t, 107.7 + i * 0.28, 108.3 + i * 0.28, easeOut);
        const isSmile = c.outcome > 0.9;
        const unsure = c.outcome > 0.2 && c.outcome < 0.9;
        return (
          <React.Fragment key={c.look.id}>
            <div style={{position: 'absolute', left: bx - bw / 2, top: by - bw * 0.59, width: bw, height: bw * 1.18, opacity: appear, transform: `translateY(${(1 - appear) * 40}px)`}}>
              <Bust look={c.look} smile={0} uid={`crowd${i}`} shirt={c.shirt} />
            </div>
            {[0, 1].map((d) => (
              <div key={d} style={{position: 'absolute', left: bx + 10 + d * 10 - 6, top: by - bw * 0.62 - 26 - d * 26, width: 12 - d * 3, height: 12 - d * 3, borderRadius: 8, background: C.cyan, opacity: thought * 0.7}} />
            ))}
            <PhotoCard
              uid={`th${i}`}
              width={cardW}
              x={bx}
              y={cy}
              opacity={thought}
              scale={0.8 + 0.2 * thought}
              smileA={c.outcome}
              smileB={c.outcome}
              glow={isSmile ? 'rgba(255,146,62,0.7)' : 'rgba(67,197,245,0.5)'}
              glowAmount={isSmile ? 1 : 0.5}
              filter={unsure ? 'blur(2.2px) saturate(0.7)' : undefined}
              vintage={false}
            />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────────────────── SCENE 9 — THE FINAL REVEAL ───────────────────────── */
export const FinaleScene: React.FC<SceneProps> = ({t}) => {
  const {W, H, P} = useLayout();
  const open = prog(t, 115.3, 116.4, easeInOut);
  const title = fadeWin(t, 116.1, 119.0, 0.6, 0.8);
  const push = prog(t, 118.0, 122.0, (x) => x * (2 - x));
  const intro = prog(t, 112.76, 114.2, easeOut);
  const w = P ? lerp(900, 720, open) : lerp(1000, 760, open);
  const ay = P ? lerp(880, 785, open) : 520;
  const by = P ? lerp(880, 1415, open) : 520;
  const ax = P ? W / 2 : lerp(W / 2, 520, open);
  const bx = P ? W / 2 : lerp(W / 2, 1400, open);
  // final push toward the remembered smile
  const target = photoPt(bx, by, w, 404, 236);
  const zoom = 1 + (P ? 0.75 : 0.85) * push;
  return (
    <AbsoluteFill>
    <AbsoluteFill style={{transformOrigin: `${target.x}px ${target.y}px`, transform: `scale(${zoom})`}}>
      <PhotoCard
        uid="finB"
        width={w}
        x={bx}
        y={by}
        rot={lerp(0, 1.5, open)}
        smileA={open}
        smileB={open}
        opacity={open}
        glow="rgba(67,197,245,0.6)"
        glowAmount={open}
        label={{text: 'What you remember', variant: 'memory', opacity: prog(t, 116.0, 116.5) * (1 - push)}}
        labelSize={P ? 28 : 24}
        filter={`saturate(${1 - 0.15 * open})`}
      />
      <PhotoCard
        uid="finA"
        width={w}
        x={ax}
        y={ay}
        rot={lerp(0, -1.5, open)}
        scale={0.96 + 0.04 * intro}
        smileA={0}
        smileB={0}
        opacity={intro * (1 - 0.55 * push)}
        label={{text: 'What happened', variant: 'original', opacity: prog(t, 115.8, 116.3) * (1 - push)}}
        labelSize={P ? 28 : 24}
      />
    </AbsoluteFill>
      <At x={W / 2} y={P ? 300 : 975} o={title} s={0.96 + 0.04 * title}>
        <Headline size={P ? 96 : 92} style={{width: P ? 900 : 1800, textShadow: '0 4px 40px rgba(4,10,28,0.95)'}}>
          The past didn't change.
        </Headline>
      </At>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(4,10,28,0) 50%, rgba(4,10,28,0.7) 100%)', opacity: 0.4 + 0.5 * push}} />
    </AbsoluteFill>
  );
};
