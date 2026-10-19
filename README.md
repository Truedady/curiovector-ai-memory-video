# CurioVector — Episode 4: AI Can Make You Remember Things That Never Happened

Remotion (React + TypeScript + SVG) source for the landscape and Shorts versions of the episode.

| Composition ID | Size | FPS | Output |
| --- | --- | --- | --- |
| `CurioVectorMemoryLandscape` | 1920 × 1080 | 30 | `out/CurioVector_AI_Memory_16x9.mp4` |
| `CurioVectorMemoryShorts` | 1080 × 1920 | 30 | `out/CurioVector_AI_Memory_9x16.mp4` |

Both compositions are 3660 frames (122.0 s): the full 121.47 s voiceover plus a short final hold.
They use one shared timeline, the same narration, the same sound cues and the same scene boundaries.
Each scene lays itself out separately for 16:9 and for 9:16, so neither version is a crop of the other.

## Inputs (final, untouched)

- `memory_script.txt`: the narration script.
- `memory_voiceover.mp3`: the master audio. `npm run sync-audio` copies it into `public/` before each render.

## Render

```bash
npm ci                     # first time only
npm run render:landscape   # -> out/CurioVector_AI_Memory_16x9.mp4  (H.264 + AAC)
npm run render:shorts      # -> out/CurioVector_AI_Memory_9x16.mp4  (H.264 + AAC)
npm run studio             # interactive preview
npm run typecheck
```

`remotion.config.ts` uses a locally installed headless Chromium if one exists at the cloud-container path.
Otherwise Remotion downloads its own browser.

## Structure

```
src/
  timeline.ts          sentence-level timing (from ffmpeg silencedetect), scene boundaries, SFX cues
  MemoryVideo.tsx      shared master composition (scene crossfades, backdrop, audio)
  Root.tsx             the two composition definitions
  art/Face.tsx         illustrated faces: FaceBase (identity) + FaceExpression (the only part the "AI edit" changes)
  art/PhotoArt.tsx     the central illustrated photograph, built in layers (sky / place / clothing / faces / expressions)
  art/Figures.tsx      profile character, brain, cine camera, participant symbol
  art/Keepsakes.tsx    family album, vacation video, restored film, crowd busts
  ui/                  backdrop lighting, typography, photo cards, face fragments
  scenes/              Opening (hook, edit, question), Study (experiment, result), Memory, Ending
public/
  fonts/               Inter / Inter Display (SIL OFL)
  sfx/                 sound effects synthesized with ffmpeg (shutter, shimmer, whoosh, bell, tick, drone, slide)
```

## Scientific source

MIT Media Lab, “Synthetic Human Memories: AI-Edited Images and Videos Can Implant False Memories and Distort Recollection”, CHI 2025, https://doi.org/10.1145/3706598.3713697.

The video presents the study's results this way:

- There were 200 participants, preregistered, in 4 conditions of 50 each.
- AI videos made from AI-edited images produced 2.05× as many false recollections as the control condition. This is a relative count, not a percentage of people.
- Confidence in false recollections in that condition was 1.19× the control level. The video labels this as confidence, not accuracy.

The illustrated photograph and the smile edit only demonstrate the idea. They are not stimuli from the study.
