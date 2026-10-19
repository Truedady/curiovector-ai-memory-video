import React from 'react';
import {AbsoluteFill} from 'remotion';
import {easeOut, fadeWin, lerp, prog, rand} from '../anim';
import {LayerKey, LayerT, PhotoArt} from '../art/PhotoArt';
import {Brain, Camera, Thinker} from '../art/Figures';
import {C} from '../theme';
import {PhotoCard} from '../ui/PhotoCard';
import {Chip, Headline} from '../ui/Type';
import {At, SceneProps, useLayout} from './common';

/** Pieces of a memory, the order they arrive in, and where they fly in from (photo units). */
const PIECES: {k: LayerKey; label: string; t: number; from: [number, number, number]}[] = [
  {k: 'sky', label: 'Background', t: 64.95, from: [-520, -260, -14]},
  {k: 'place', label: 'Familiar place', t: 65.75, from: [560, -200, 12]},
  {k: 'clothing', label: 'Clothing', t: 66.55, from: [-480, 380, 10]},
  {k: 'faces', label: 'Faces', t: 67.35, from: [520, 360, -10]},
  {k: 'expressions', label: 'Expressions', t: 68.15, from: [0, -520, 8]},
];

const MemoryFrame: React.FC<{w: number; x: number; y: number; o: number; solid: number; children: React.ReactNode}> = ({w, x, y, o, solid, children}) => {
  const h = w * 0.75;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: o}}>
      <div
        style={{
          position: 'absolute',
          inset: -18,
          borderRadius: 26,
          border: `3px ${solid > 0.5 ? 'solid' : 'dashed'} rgba(67,197,245,${0.35 + 0.35 * solid})`,
          boxShadow: `0 0 70px rgba(67,197,245,${0.15 + 0.2 * solid}), inset 0 0 50px rgba(67,197,245,0.12)`,
        }}
      />
      <div style={{position: 'absolute', inset: 0, overflow: 'visible'}}>{children}</div>
    </div>
  );
};

export const MemoryScene: React.FC<SceneProps> = ({t}) => {
  const {W, H, P} = useLayout();

  /* Part A — the question + "Here's the secret" (56.26 → 60.6) */
  const aO = 1 - prog(t, 60.4, 60.9);
  const dim = prog(t, 59.3, 60.2);
  /* Part B — memory isn't a video (60.84 → 64.8) */
  const bO = fadeWin(t, 60.75, 65.2, 0.45, 0.5);
  /* Part C/D/E — reconstruction (64.82 → 82.26) */
  const cO = prog(t, 64.6, 65.2);

  const fw = P ? 960 : 900;
  const fx = P ? W / 2 : 1200;
  const fy = P ? 720 : 520;
  const k = fw / 800; // photo unit → screen px

  const layers: Partial<Record<LayerKey, LayerT>> = {};
  for (const p of PIECES) {
    const a = prog(t, p.t, p.t + 1.0, easeOut);
    layers[p.k] = {
      x: p.from[0] * (1 - a),
      y: p.from[1] * (1 - a),
      rot: p.from[2] * (1 - a),
      scale: 0.7 + 0.3 * a,
      opacity: prog(t, p.t - 0.1, p.t + 0.35),
    };
  }
  // new information slips in: the AI smile replaces the neutral expression
  const slip = prog(t, 70.3, 72.2);
  const handoff = prog(t, 71.6, 72.4);
  const settle = prog(t, 74.2, 77.5); // orange glow cools: the detail feels familiar
  const srcX = P ? 790 : 1700; // edited card position (screen)
  const srcY = P ? 290 : 170;
  const ghostFrom = {x: (srcX - fx) / k, y: (srcY - fy) / k};
  layers.expressions = {...layers.expressions, opacity: (layers.expressions?.opacity ?? 1) * (1 - handoff), y: 40 * handoff};
  const ghost = {
    smile: 1,
    t: {x: ghostFrom.x * (1 - slip), y: ghostFrom.y * (1 - slip), scale: 0.25 + 0.75 * slip, opacity: prog(t, 70.0, 70.4)},
    glow: prog(t, 70.2, 70.6) * (1 - settle),
  };
  const push = prog(t, 76.9, 82.3, (x) => x);
  const cardIn = fadeWin(t, 69.9, 73.6, 0.4, 0.6);

  return (
    <AbsoluteFill>
      {/* ── Part A ── */}
      {aO > 0 ? (
        <AbsoluteFill style={{opacity: aO}}>
          <div style={{position: 'absolute', left: P ? W / 2 - 330 : 120, top: P ? H - 780 : 290, width: P ? 620 : 700, height: P ? 674 : 760}}>
            <Thinker uid="ma" glow={0.5 + 0.4 * dim} />
          </div>
          <div style={{opacity: 1 - 0.75 * dim}}>
            <PhotoCard
              uid="mcard"
              width={P ? 700 : 660}
              x={P ? W / 2 : 1240}
              y={(P ? 700 : 470) + Math.sin(t * 1.4) * 10}
              rot={Math.sin(t * 0.8) * 3}
              smileA={1}
              smileB={1}
              label={{text: 'AI-Edited', variant: 'edited'}}
              labelSize={P ? 28 : 24}
              scale={0.92 + 0.08 * prog(t, 56.2, 57.2, easeOut)}
            />
          </div>
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at ${P ? '50% 70%' : '28% 55%'}, rgba(8,19,47,0) 0%, rgba(4,10,28,${0.7 * dim}) 45%)`,
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* ── Part B: camera vs brain ── */}
      {bO > 0 ? (
        <AbsoluteFill style={{opacity: bO}}>
          <At x={W / 2} y={P ? 330 : 140} s={0.94 + 0.06 * prog(t, 61.2, 61.9, easeOut)} o={prog(t, 61.2, 61.7)}>
            <Headline size={P ? 86 : 78} style={{width: P ? 900 : 1600}}>
              Your memory isn't a video
            </Headline>
          </At>
          {/* camera + continuous film strip */}
          <div style={{position: 'absolute', left: P ? 120 : 130, top: P ? 520 : 380, width: P ? 380 : 400, height: P ? 275 : 290}}>
            <Camera uid="mb" reel={t * 120} rec={0.5 + 0.5 * Math.sin(t * 6)} />
          </div>
          <div style={{position: 'absolute', left: P ? 500 : 540, top: P ? 600 : 460, width: P ? 580 : 400, height: 120, overflow: 'hidden', maskImage: 'linear-gradient(90deg, #000 70%, transparent)'}}>
            <div style={{display: 'flex', gap: 10, transform: `translateX(${-((t * 140) % 170)}px)`, background: '#05091a', padding: '14px 0'}}>
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} style={{width: 160, height: 92, flex: 'none', border: '2px solid rgba(67,197,245,0.4)', overflow: 'hidden'}}>
                  <div style={{width: 160, height: 120, marginTop: -14}}>
                    <PhotoArt uid={`fs${i}`} smileA={0} smileB={0} vintage={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <At x={P ? 310 : 330} y={P ? 860 : 740}>
            <Chip text="Recording" variant="plain" size={P ? 28 : 24} />
          </At>
          {/* brain + scattered pieces */}
          <div style={{position: 'absolute', left: P ? W / 2 - 260 : 1180, top: P ? 1040 : 330, width: P ? 520 : 540, height: P ? 416 : 432}}>
            <Brain uid="mb" draw={prog(t, 61.0, 62.6)} glow={0.6 + 0.4 * Math.sin(t * 2)} />
          </div>
          {Array.from({length: 7}).map((_, i) => {
            const a = (i / 7) * Math.PI * 2 + t * 0.35;
            const r = P ? 330 : 330;
            const cx = (P ? W / 2 : 1450) + Math.cos(a) * r;
            const cy = (P ? 1250 : 545) + Math.sin(a) * r * 0.55;
            const sz = 90 + rand(i) * 40;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: cx - sz / 2,
                  top: cy - sz / 2,
                  width: sz,
                  height: sz * 0.75,
                  overflow: 'hidden',
                  borderRadius: 8,
                  border: '2px solid rgba(67,197,245,0.6)',
                  opacity: prog(t, 62.0 + i * 0.15, 62.5 + i * 0.15) * 0.9,
                  transform: `rotate(${(rand(i + 3) - 0.5) * 30}deg)`,
                }}
              >
                <div style={{width: sz * 3, height: sz * 2.25, marginLeft: -sz * rand(i + 5) * 2, marginTop: -sz * rand(i + 8) * 1.4}}>
                  <PhotoArt uid={`pc${i}`} smileA={0} smileB={0} vintage={false} />
                </div>
              </div>
            );
          })}
          <At x={P ? W / 2 : 1450} y={P ? 1540 : 860} o={prog(t, 63.0, 63.5)}>
            <Chip text="Reconstruction" variant="memory" size={P ? 28 : 24} />
          </At>
        </AbsoluteFill>
      ) : null}

      {/* ── Part C/D/E: building the memory ── */}
      {cO > 0 ? (
        <AbsoluteFill style={{opacity: cO, transformOrigin: `${fx}px ${fy - 40}px`, transform: `scale(${1 + 0.22 * push})`}}>
          <div style={{position: 'absolute', left: P ? W / 2 - 300 : 20, top: P ? H - 700 : 360, width: P ? 560 : 560, height: P ? 608 : 608, opacity: 1 - 0.6 * push}}>
            <Thinker uid="mc" glow={0.7} />
          </div>
          {/* a beam of light from the mind to the reconstruction */}
          <div
            style={{
              position: 'absolute',
              left: P ? W / 2 - 160 : 380,
              top: P ? fy + fw * 0.375 : 420,
              width: P ? 320 : fx - fw / 2 - 380,
              height: P ? H - 700 - (fy + fw * 0.375) + 160 : 300,
              background: P
                ? 'linear-gradient(0deg, rgba(67,197,245,0.25), rgba(67,197,245,0))'
                : 'linear-gradient(90deg, rgba(67,197,245,0.25), rgba(67,197,245,0))',
              filter: 'blur(30px)',
              opacity: 0.8,
            }}
          />
          <MemoryFrame w={fw} x={fx} y={fy} o={1} solid={prog(t, 74.5, 76)}>
            <div style={{width: fw, height: fw * 0.75, filter: `saturate(${0.85 + 0.15 * settle}) brightness(1.03)`}}>
              <PhotoArt uid="recon" smileA={0} smileB={0} layers={layers} ghostExpression={ghost} />
            </div>
            <div style={{position: 'absolute', left: 22, top: 22, opacity: prog(t, 65.0, 65.5)}}>
              <Chip text="Memory" variant="memory" size={P ? 28 : 24} />
            </div>
          </MemoryFrame>
          {/* fragment labels */}
          {PIECES.map((p) => {
            const o = fadeWin(t, p.t, p.t + 1.5, 0.25, 0.4);
            if (o <= 0) return null;
            const a = prog(t, p.t, p.t + 1.0, easeOut);
            const x = fx + p.from[0] * k * (1 - a) * 0.6;
            const y = fy + p.from[1] * k * (1 - a) * 0.6 - (P ? 0 : 0);
            return (
              <At key={p.k} x={x} y={y} o={o}>
                <Chip text={p.label} variant="plain" size={P ? 30 : 26} />
              </At>
            );
          })}
          {/* the edited photo that supplies the new detail */}
          {cardIn > 0 ? (
            <PhotoCard
              uid="msrc"
              width={P ? 300 : 300}
              x={srcX}
              y={srcY}
              rot={4}
              opacity={cardIn}
              smileA={1}
              smileB={1}
              glow="rgba(255,146,62,0.6)"
              glowAmount={1}
              label={{text: 'AI-Edited', variant: 'edited'}}
              labelSize={18}
            />
          ) : null}
          <At x={fx} y={fy + fw * 0.375 + (P ? 70 : 64)} o={fadeWin(t, 70.6, 73.8, 0.4, 0.5)}>
            <Chip text="New information slips in" variant="edited" size={P ? 30 : 24} />
          </At>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
