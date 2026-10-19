import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {easeOut, fadeWin, lerp, prog} from '../anim';
import {ParticipantSymbol} from '../art/Figures';
import {C, FONT_DISPLAY, FONT_TEXT} from '../theme';
import {Footnote, Headline, Kicker, Sparkle} from '../ui/Type';
import {At, SceneProps, useLayout} from './common';

export const SOURCE_NOTE = 'MIT Media Lab · “Synthetic Human Memories” · CHI 2025 · doi.org/10.1145/3706598.3713697';

const GROUPS = [
  {label: 'Original images', tag: 'Control', icon: 'photo'},
  {label: 'AI-edited images', icon: 'edited'},
  {label: 'AI videos', icon: 'video'},
  {label: 'AI videos from edited images', icon: 'video-edited'},
] as const;

const GroupIcon: React.FC<{kind: string; size: number; color: string}> = ({kind, size, color}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{overflow: 'visible', flex: 'none'}}>
    <rect x={3} y={8} width={42} height={32} rx={5} fill="none" stroke={color} strokeWidth={3} />
    {kind.startsWith('video') ? (
      <path d="M 19 16 L 32 24 L 19 32 Z" fill={color} />
    ) : (
      <>
        <path d="M 7 36 L 18 24 L 26 31 L 32 26 L 41 36 Z" fill={color} opacity={0.8} />
        <circle cx={33} cy={17} r={4} fill={color} />
      </>
    )}
    {kind.endsWith('edited') ? (
      <g transform="translate(42 8) scale(0.85)">
        <circle r={10} fill={C.navy} />
        <path d="M 0 -9 C 1 -3 3 -1 9 0 C 3 1 1 3 0 9 C -1 3 -3 1 -9 0 C -3 -1 -1 -3 0 -9 Z" fill={C.orange} />
      </g>
    ) : null}
  </svg>
);

const Steps: React.FC<{active: number; size: number; o: number}> = ({active, size, o}) => {
  const steps = ['See originals', 'See assigned version', 'Memory test'];
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: size * 0.6, opacity: o, fontFamily: FONT_TEXT}}>
      {steps.map((s, i) => {
        const on = Math.round(active) === i;
        const done = active > i + 0.5;
        return (
          <React.Fragment key={s}>
            {i > 0 ? <div style={{width: size * 1.4, height: 2, background: done || on ? C.cyan : 'rgba(248,250,255,0.25)'}} /> : null}
            <div
              style={{
                padding: `${size * 0.45}px ${size * 0.8}px`,
                borderRadius: size * 2,
                fontSize: size,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color: on ? C.navy : done ? C.cyan : 'rgba(248,250,255,0.55)',
                background: on ? C.cyan : 'transparent',
                border: `2px solid ${on || done ? C.cyan : 'rgba(248,250,255,0.25)'}`,
                boxShadow: on ? '0 0 30px rgba(67,197,245,0.5)' : undefined,
              }}
            >
              {s}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ───────────────────────── SCENE 4 — THE MIT EXPERIMENT ───────────────────────── */
export const StudyScene: React.FC<SceneProps> = ({t}) => {
  const {W, H, P} = useLayout();
  const titleO = fadeWin(t, 21.49, 26.1, 0.5, 0.5);
  const gridO = prog(t, 25.85, 26.3);
  const stepActive = t < 30.6 ? 0 : t < 36.6 ? 1 : 2;
  const resultFocus = prog(t, 40.15, 40.8);

  // Participant layout
  const N = 200;
  const people = Array.from({length: N}).map((_, i) => {
    const g = Math.floor(i / 50);
    const j = i % 50;
    let ix: number, iy: number, gx: number, gy: number;
    if (!P) {
      ix = 408 + (i % 25) * 46;
      iy = 410 + Math.floor(i / 25) * 46;
      const gcx = [270, 723, 1176, 1630][g];
      gx = gcx + ((j % 10) - 4.5) * 34;
      gy = 520 + (Math.floor(j / 10) - 2) * 34;
    } else {
      ix = 315 + (i % 10) * 50;
      iy = 545 + Math.floor(i / 10) * 47;
      gx = 290 + ((j % 10) - 4.5) * 40;
      gy = [640, 890, 1140, 1390][g] + (Math.floor(j / 10) - 2) * 40;
    }
    const appear = prog(t, 26.0 + (i / N) * 1.5, 26.35 + (i / N) * 1.5, easeOut);
    const sp = prog(t, 28.3 + g * 0.14 + (j / 50) * 0.3, 29.3 + g * 0.14 + (j / 50) * 0.3);
    const x = lerp(ix, gx, sp);
    const y = lerp(iy, gy, sp);
    const size = lerp(P ? 38 : 34, P ? 32 : 28, sp) * appear;
    const testing = fadeWin(t, 36.8, 40.2, 0.3, 0.4);
    const wave = 0.5 + 0.5 * Math.sin(t * 6 - (j % 10) * 0.6 - g);
    let color: string = C.cyan;
    let op = 0.9 - 0.35 * testing * wave;
    if (g === 3) {
      color = interpolate(resultFocus, [0, 1], [0, 1]) > 0.5 ? C.orange : C.cyan;
    } else {
      op *= 1 - 0.65 * resultFocus;
    }
    return {x, y, size, color, op};
  });

  const counter = Math.round(200 * prog(t, 26.0, 27.5, (x) => x));
  const groupLabelT = [30.7, 33.25, 34.45, 35.35];

  return (
    <AbsoluteFill>
      {/* Title card — the study */}
      {titleO > 0 ? (
        <AbsoluteFill style={{opacity: titleO}}>
          <At x={P ? W / 2 : 560} y={P ? 640 : H / 2} s={1 + 0.03 * prog(t, 21.5, 26, (x) => x)}>
            <svg width={P ? 420 : 400} height={P ? 520 : 500} viewBox="0 0 400 500">
              <defs>
                <linearGradient id="doc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#112456" />
                  <stop offset="100%" stopColor="#08132F" />
                </linearGradient>
              </defs>
              <rect x={30} y={20} width={340} height={460} rx={16} fill="url(#doc)" stroke={C.cyan} strokeWidth={3} />
              <rect x={70} y={70} width={200} height={16} rx={8} fill={C.cyan} opacity={0.9} />
              <rect x={70} y={100} width={150} height={12} rx={6} fill={C.cyan} opacity={0.5} />
              {Array.from({length: 7}).map((_, i) => (
                <rect key={i} x={70} y={150 + i * 26} width={i % 3 === 2 ? 180 : 260} height={8} rx={4} fill={C.white} opacity={0.18} />
              ))}
              <rect x={70} y={350} width={120} height={90} rx={6} fill="none" stroke={C.orange} strokeWidth={3} />
              <path d="M 80 430 L 110 400 L 130 418 L 150 404 L 180 430 Z" fill={C.orange} opacity={0.7} />
              <rect x={210} y={350} width={120} height={90} rx={6} fill="none" stroke={C.cyan} strokeWidth={3} />
              <path d="M 258 380 L 282 395 L 258 410 Z" fill={C.cyan} />
            </svg>
          </At>
          <div
            style={{
              position: 'absolute',
              left: P ? 80 : 860,
              top: P ? 980 : 330,
              width: P ? W - 160 : 940,
              textAlign: P ? 'center' : 'left',
              transform: `translateY(${(1 - prog(t, 21.6, 22.6, easeOut)) * 30}px)`,
            }}
          >
            <Kicker size={P ? 30 : 28}>MIT Media Lab · CHI 2025</Kicker>
            <Headline size={P ? 92 : 96} style={{marginTop: 26}}>
              Synthetic Human Memories
            </Headline>
            <div style={{fontFamily: FONT_TEXT, fontWeight: 500, fontSize: P ? 34 : 32, lineHeight: 1.35, color: C.muted, marginTop: 28}}>
              AI-edited images and videos can implant false memories and distort recollection
            </div>
            <div style={{marginTop: 34, display: 'flex', gap: 16, justifyContent: P ? 'center' : 'flex-start', opacity: prog(t, 23.0, 23.6)}}>
              <div style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: P ? 26 : 24, letterSpacing: '0.14em', color: C.orange, border: `2px solid ${C.orange}`, borderRadius: 30, padding: '10px 22px'}}>
                PREREGISTERED STUDY
              </div>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {gridO > 0 ? (
        <AbsoluteFill style={{opacity: gridO}}>
          <At x={W / 2} y={P ? 262 : 92}>
            <Steps active={stepActive} size={P ? 21 : 22} o={1} />
          </At>
          <At x={W / 2} y={P ? 410 : 230}>
            <Headline size={P ? 96 : 84}>
              <span style={{color: C.cyan}}>{counter}</span> participants
            </Headline>
          </At>
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            <defs>
              <ParticipantSymbol />
            </defs>
            {people.map((p, i) =>
              p.size > 0.5 ? (
                <use key={i} href="#cv-person" x={p.x - p.size / 2} y={p.y - p.size / 2} width={p.size} height={p.size} fill={p.color} opacity={p.op} />
              ) : null,
            )}
          </svg>
          {/* group labels */}
          {GROUPS.map((g, i) => {
            const o = prog(t, groupLabelT[i], groupLabelT[i] + 0.4, easeOut);
            const isWinner = i === 3;
            const dim = isWinner ? 1 : 1 - 0.6 * resultFocus;
            const col = isWinner && resultFocus > 0.5 ? C.orange : C.white;
            const iconCol = isWinner && resultFocus > 0.5 ? C.orange : C.cyan;
            const tested = prog(t, 36.9 + i * 0.15, 37.3 + i * 0.15, easeOut);
            const label = (
              <div style={{display: 'flex', flexDirection: P ? 'row' : 'column', alignItems: 'center', gap: P ? 22 : 14}}>
                <GroupIcon kind={g.icon} size={P ? 64 : 54} color={iconCol} />
                <div style={{textAlign: P ? 'left' : 'center'}}>
                  <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: P ? 36 : 28, lineHeight: 1.1, color: col, textTransform: 'uppercase', letterSpacing: '0.01em'}}>
                    {g.label}
                  </div>
                  <div style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: P ? 24 : 21, letterSpacing: '0.16em', color: C.muted, marginTop: 8, textTransform: 'uppercase'}}>
                    50 people{'tag' in g ? ` · ${g.tag}` : ''}
                  </div>
                </div>
              </div>
            );
            const test = (
              <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, opacity: tested * (1 - 0.6 * resultFocus * (isWinner ? 0 : 1)), marginTop: P ? 12 : 16}}>
                <svg width={30} height={34} viewBox="0 0 30 34">
                  <rect x={2} y={4} width={26} height={28} rx={4} fill="none" stroke={C.cyan} strokeWidth={2.5} />
                  <rect x={9} y={1} width={12} height={6} rx={2} fill={C.cyan} />
                  <path d="M 8 16 l 4 4 l 9 -9" stroke={C.cyan} strokeWidth={2.5} fill="none" />
                </svg>
                <span style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: P ? 22 : 20, letterSpacing: '0.14em', color: C.cyan}}>MEMORY TEST</span>
              </div>
            );
            return P ? (
              <div key={i} style={{position: 'absolute', left: 530, top: [640, 890, 1140, 1390][i] - 70, width: 420, opacity: o * dim}}>
                {label}
                <div style={{paddingLeft: 86}}>{test}</div>
              </div>
            ) : (
              <div key={i} style={{position: 'absolute', left: [270, 723, 1176, 1630][i] - 205, top: 640, width: 410, textAlign: 'center', opacity: o * dim}}>
                {label}
                {test}
              </div>
            );
          })}
          {/* the stand-out group */}
          {resultFocus > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: P ? 90 : 1630 - 205,
                top: P ? 1390 - 120 : 418,
                width: P ? 900 : 410,
                height: P ? 240 : 420,
                borderRadius: 22,
                border: `3px solid ${C.orange}`,
                boxShadow: `0 0 50px rgba(255,146,62,0.45), inset 0 0 40px rgba(255,146,62,0.12)`,
                opacity: resultFocus,
              }}
            />
          ) : null}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: P ? 330 : 40, textAlign: 'center', opacity: prog(t, 26.5, 27.2)}}>
            <Footnote size={P ? 22 : 20}>{SOURCE_NOTE}</Footnote>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* ───────────────────────── SCENE 5 — THE RESULT ───────────────────────── */
const Bar: React.FC<{x: number; base: number; h: number; w: number; color: string; value: string; label: React.ReactNode; size: number; glow?: boolean}> = ({
  x,
  base,
  h,
  w,
  color,
  value,
  label,
  size,
  glow,
}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: base - h,
        width: w,
        height: h,
        borderRadius: '14px 14px 4px 4px',
        background: `linear-gradient(180deg, ${color}, ${color}55)`,
        boxShadow: glow ? `0 0 60px ${color}88` : undefined,
      }}
    />
    <At x={x} y={base - h - size * 0.9}>
      <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size * 1.5, color}}>{value}</div>
    </At>
    <div style={{position: 'absolute', left: x - 200, width: 400, top: base + 22, textAlign: 'center'}}>{label}</div>
  </>
);

const BarLabel: React.FC<{main: string; sub?: string; size: number; color?: string}> = ({main, sub, size, color = C.white}) => (
  <>
    <div style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.1, color, textTransform: 'uppercase'}}>{main}</div>
    {sub ? (
      <div style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: size * 0.75, color: C.muted, marginTop: 6, letterSpacing: '0.1em', textTransform: 'uppercase'}}>{sub}</div>
    ) : null}
  </>
);

const Meter: React.FC<{label: string; value: number; shown: number; color: string; width: number; size: number}> = ({label, value, shown, color, width, size}) => {
  const max = 1.4;
  return (
    <div style={{width}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: FONT_TEXT, fontWeight: 600, fontSize: size, letterSpacing: '0.12em', color: C.muted, textTransform: 'uppercase', marginBottom: 14}}>
        <span>{label}</span>
        <span style={{fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size * 1.6, color, letterSpacing: 0}}>{(value * shown).toFixed(2)}×</span>
      </div>
      <div style={{position: 'relative', height: size * 0.9, borderRadius: size, background: 'rgba(248,250,255,0.08)', border: '1.5px solid rgba(248,250,255,0.15)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${((value * shown) / max) * 100}%`, borderRadius: size, background: `linear-gradient(90deg, ${color}44, ${color})`, boxShadow: `0 0 24px ${color}66`}} />
        <div style={{position: 'absolute', left: `${(1 / max) * 100}%`, top: -10, bottom: -10, width: 2, background: C.white, opacity: 0.35}} />
      </div>
    </div>
  );
};

export const ResultScene: React.FC<SceneProps> = ({t}) => {
  const {W, P} = useLayout();
  const aO = prog(t, 42.18, 42.7) * (1 - prog(t, 50.7, 51.3));
  const bO = prog(t, 51.2, 51.9);
  const ctrl = prog(t, 42.6, 43.6, easeOut);
  const ai = prog(t, 44.0, 47.2);
  const big = prog(t, 47.0, 47.6, easeOut);
  const conf = prog(t, 52.3, 54.0);
  const unit = P ? 285 : 265;
  const base = P ? 1390 : 850;
  const bx = P ? [320, 760] : [1200, 1590];
  const bw = P ? 230 : 210;
  const aiVal = 1 + 1.05 * ai;

  return (
    <AbsoluteFill>
      {aO > 0 ? (
        <AbsoluteFill style={{opacity: aO, transform: `translateY(${-40 * prog(t, 50.7, 51.3)}px)`}}>
          <div style={{position: 'absolute', left: P ? 70 : 130, top: P ? 250 : 250, width: P ? W - 140 : 900, textAlign: P ? 'center' : 'left'}}>
            <Kicker size={P ? 28 : 26}>Result · relative to control condition</Kicker>
            <div style={{height: P ? 230 : 250, position: 'relative'}}>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 900,
                  fontSize: P ? 230 : 250,
                  lineHeight: 1,
                  color: C.orange,
                  marginTop: 14,
                  opacity: big,
                  transform: `scale(${0.85 + 0.15 * big})`,
                  transformOrigin: P ? 'center' : 'left center',
                  textShadow: '0 0 60px rgba(255,146,62,0.45)',
                  letterSpacing: '-0.03em',
                }}
              >
                2.05×
              </div>
            </div>
            <Headline size={P ? 70 : 72} style={{marginTop: P ? 10 : 20}}>
              False recollections
            </Headline>
            <div style={{fontFamily: FONT_TEXT, fontWeight: 500, fontSize: P ? 32 : 30, color: C.muted, marginTop: 18}}>
              Relative to control condition
            </div>
          </div>
          {/* gridlines */}
          {[1, 2].map((v) => (
            <React.Fragment key={v}>
              <div style={{position: 'absolute', left: bx[0] - bw / 2 - 60, width: bx[1] - bx[0] + bw + 100, top: base - v * unit, height: 0, borderTop: '2px dashed rgba(248,250,255,0.22)'}} />
              <div style={{position: 'absolute', left: bx[0] - bw / 2 - 110, top: base - v * unit - 18, fontFamily: FONT_TEXT, fontWeight: 600, fontSize: 26, color: C.muted}}>{v}×</div>
            </React.Fragment>
          ))}
          <div style={{position: 'absolute', left: bx[0] - bw / 2 - 60, width: bx[1] - bx[0] + bw + 100, top: base, height: 3, background: 'rgba(248,250,255,0.5)'}} />
          <Bar x={bx[0]} base={base} h={unit * ctrl} w={bw} color={C.cyan} value="1.00×" size={P ? 34 : 30} label={<BarLabel main="Control" sub="Original images" size={P ? 30 : 26} />} />
          <Bar
            x={bx[1]}
            base={base}
            h={unit * aiVal * ctrl}
            w={bw}
            color={C.orange}
            glow
            value={`${aiVal.toFixed(2)}×`}
            size={P ? 34 : 30}
            label={<BarLabel main="AI videos from edited images" size={P ? 30 : 26} color={C.orange} />}
          />
        </AbsoluteFill>
      ) : null}
      {bO > 0 ? (
        <AbsoluteFill style={{opacity: bO, transform: `translateY(${30 * (1 - bO)}px)`}}>
          <div style={{position: 'absolute', left: P ? 70 : 130, top: P ? 250 : 280, width: P ? W - 140 : 820, textAlign: P ? 'center' : 'left'}}>
            <Kicker size={P ? 28 : 26}>In the same condition</Kicker>
            <div style={{fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: P ? 200 : 210, lineHeight: 1, color: C.cyan, marginTop: 20, letterSpacing: '-0.03em', textShadow: '0 0 60px rgba(67,197,245,0.4)'}}>
              1.19×
            </div>
            <Headline size={P ? 76 : 76} style={{marginTop: 16}}>
              Confidence
            </Headline>
            <div style={{fontFamily: FONT_TEXT, fontWeight: 500, fontSize: P ? 32 : 30, lineHeight: 1.4, color: C.muted, marginTop: 20}}>
              Confidence in <span style={{color: C.white}}>false</span> recollections, relative to control.
              <br />
              Feeling sure ≠ being accurate.
            </div>
          </div>
          <div style={{position: 'absolute', left: P ? 90 : 1040, top: P ? 1060 : 380, display: 'flex', flexDirection: 'column', gap: P ? 110 : 80}}>
            <Meter label="Control" value={1} shown={prog(t, 52.0, 52.8)} color={C.white} width={P ? 900 : 760} size={P ? 28 : 26} />
            <Meter label="AI videos from edited images" value={1.19} shown={conf} color={C.cyan} width={P ? 900 : 760} size={P ? 28 : 26} />
          </div>
        </AbsoluteFill>
      ) : null}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: P ? 330 : 40, textAlign: 'center', opacity: prog(t, 42.3, 42.9)}}>
        <Footnote size={P ? 22 : 20}>{SOURCE_NOTE}</Footnote>
      </div>
    </AbsoluteFill>
  );
};
