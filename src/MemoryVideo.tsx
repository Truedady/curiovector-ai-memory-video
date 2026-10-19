import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {prog} from './anim';
import {Backdrop} from './ui/Backdrop';
import {EditScene, HookScene, QuestionScene} from './scenes/Opening';
import {ResultScene, StudyScene} from './scenes/Study';
import {MemoryScene} from './scenes/Memory';
import {ConsequencesScene, FinaleScene, QualificationScene} from './scenes/Ending';
import {f, FPS, SceneKey, SCENES, SFX} from './timeline';

const SCENE_COMPONENTS: Record<SceneKey, React.FC<{t: number}>> = {
  hook: HookScene,
  edit: EditScene,
  question: QuestionScene,
  study: StudyScene,
  result: ResultScene,
  memory: MemoryScene,
  consequences: ConsequencesScene,
  qualification: QualificationScene,
  finale: FinaleScene,
};

// Backdrop lighting per scene (focus point + warmth)
const LIGHT: Record<SceneKey, {fx: number; fy: number; warm: number; cyan: number}> = {
  hook: {fx: 0.5, fy: 0.45, warm: 0.6, cyan: 0.4},
  edit: {fx: 0.5, fy: 0.5, warm: 0.4, cyan: 0.6},
  question: {fx: 0.6, fy: 0.45, warm: 0.3, cyan: 0.8},
  study: {fx: 0.5, fy: 0.45, warm: 0.2, cyan: 0.7},
  result: {fx: 0.55, fy: 0.5, warm: 0.7, cyan: 0.5},
  memory: {fx: 0.55, fy: 0.45, warm: 0.4, cyan: 0.9},
  consequences: {fx: 0.5, fy: 0.5, warm: 0.6, cyan: 0.5},
  qualification: {fx: 0.5, fy: 0.5, warm: 0.3, cyan: 0.6},
  finale: {fx: 0.5, fy: 0.5, warm: 0.5, cyan: 0.7},
};

const FADE = 0.35;

/** One shared timeline; each scene reads the absolute narration time `t` and the layout from the composition size. */
export const MemoryVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const keys = Object.keys(SCENES) as SceneKey[];
  const current = keys.find((k) => t >= SCENES[k].from && t < SCENES[k].to) ?? 'finale';
  const L = LIGHT[current];
  return (
    <AbsoluteFill style={{background: '#08132F'}}>
      <Backdrop t={t} warm={L.warm} cyan={L.cyan} focusX={L.fx} focusY={L.fy} />
      {keys.map((k, i) => {
        const {from, to} = SCENES[k];
        const first = i === 0;
        const last = i === keys.length - 1;
        if (t < from - FADE || t > to + FADE) return null;
        const fadeIn = first ? 1 : prog(t, from - FADE * 0.5, from + FADE * 0.5);
        const fadeOut = last ? 1 : 1 - prog(t, to - FADE * 0.5, to + FADE * 0.5);
        const o = Math.min(fadeIn, fadeOut);
        if (o <= 0) return null;
        const Comp = SCENE_COMPONENTS[k];
        return (
          <AbsoluteFill key={k} style={{opacity: o}}>
            <Comp t={t} />
          </AbsoluteFill>
        );
      })}
      {/* fine cinematic grain + edge falloff over everything */}
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(4,10,28,0) 60%, rgba(4,10,28,0.45) 100%)'}} />

      <Audio src={staticFile('memory_voiceover.mp3')} volume={1} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={f(s.t)} layout="none" name={`sfx-${s.file}`}>
          <Audio src={staticFile(`sfx/${s.file}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
