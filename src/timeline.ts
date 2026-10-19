// Master timeline derived ONCE from memory_voiceover.mp3 (121.47 s) via
// ffmpeg silencedetect (noise=-35dB, d=0.25). Each entry is the spoken
// sentence (or clause) with its start/end time in seconds.
export const FPS = 30;
export const AUDIO_SECONDS = 121.469;
export const DURATION_FRAMES = 3660; // 122.0 s: full voiceover + short clean hold

export const LINES = [
  {t: 0.0, e: 1.84, text: 'That smile never happened.'},
  {t: 2.29, e: 4.1, text: 'But your brain might remember it anyway.'},
  {t: 4.84, e: 5.95, text: 'Look at this photograph.'},
  {t: 6.41, e: 7.95, text: 'Two people standing together.'},
  {t: 8.33, e: 9.16, text: 'Nothing unusual.'},
  {t: 9.77, e: 13.74, text: 'Now watch what happens when AI changes just one detail.'},
  {t: 14.27, e: 15.49, text: 'It makes them smile.'},
  {t: 16.09, e: 17.69, text: 'You know the picture is edited.'},
  {t: 18.11, e: 20.59, text: 'But what happens when you try to remember the original?'},
  {t: 21.49, e: 25.39, text: 'Researchers at MIT tested something remarkably close to this.'},
  {t: 25.9, e: 30.16, text: 'They showed 200 people photographs, then split them into different groups.'},
  {t: 30.68, e: 32.72, text: 'Some saw the original pictures again.'},
  {t: 33.22, e: 36.15, text: 'Others saw AI-edited images or videos.'},
  {t: 36.71, e: 39.66, text: 'Then the researchers tested what people remembered.'},
  {t: 40.15, e: 41.65, text: 'And one result stood out.'},
  {t: 42.18, e: 49.97, text: 'People who watched videos made from AI-edited photos reported just over twice as many false recollections as the control group.'},
  {t: 50.6, e: 51.68, text: 'Even more surprising?'},
  {t: 52.2, e: 55.65, text: 'They were also more confident in some of those mistaken memories.'},
  {t: 56.26, e: 58.71, text: 'But how can a picture change what you remember?'},
  {t: 59.44, e: 60.33, text: "Here's the secret."},
  {t: 60.84, e: 64.29, text: "Your memory isn't a video recording stored inside your head."},
  {t: 64.82, e: 69.44, text: 'When you remember something, your brain reconstructs it from pieces of information.'},
  {t: 69.91, e: 73.52, text: 'And new information can sometimes slip into that reconstruction.'},
  {t: 74.02, e: 76.53, text: 'So when an altered photo looks familiar,'},
  {t: 76.87, e: 81.39, text: "a detail that was never there can begin to feel like something you've seen before."},
  {t: 82.26, e: 84.37, text: 'Now think about where this could lead.'},
  {t: 84.9, e: 86.01, text: 'Family photos.'},
  {t: 86.31, e: 87.49, text: 'Vacation videos.'},
  {t: 87.93, e: 90.64, text: 'Old memories brought back to life with AI.'},
  {t: 91.3, e: 93.47, text: 'A tiny change might seem harmless.'},
  {t: 93.88, e: 96.96, text: 'But if you later remember the edited version as the original,'},
  {t: 97.27, e: 99.06, text: 'something important has happened.'},
  {t: 99.6, e: 103.13, text: 'Your memory and the real event have started to drift apart.'},
  {t: 104.02, e: 107.05, text: "Now, this doesn't mean AI can control your mind."},
  {t: 107.44, e: 112.26, text: "And it certainly doesn't mean everyone who sees an edited image will develop a false memory."},
  {t: 112.76, e: 114.82, text: 'But it reveals something unsettling.'},
  {t: 115.39, e: 117.7, text: "AI doesn't have to change the past."},
  {t: 118.1, e: 121.47, text: 'It only has to change what you think you remember about it.'},
] as const;

export const f = (seconds: number) => Math.round(seconds * FPS);

// Scene boundaries (seconds) — shared by both formats.
export const SCENES = {
  hook: {from: 0, to: 4.84},
  edit: {from: 4.84, to: 18.11},
  question: {from: 18.11, to: 21.49},
  study: {from: 21.49, to: 42.18},
  result: {from: 42.18, to: 56.26},
  memory: {from: 56.26, to: 82.26},
  consequences: {from: 82.26, to: 104.02},
  qualification: {from: 104.02, to: 112.76},
  finale: {from: 112.76, to: DURATION_FRAMES / FPS},
} as const;

export type SceneKey = keyof typeof SCENES;

// Sound design cues (seconds, file, volume) — shared by both formats.
export const SFX: {t: number; file: string; v: number}[] = [
  {t: 0.0, file: 'shutter', v: 0.35},
  {t: 0.85, file: 'shimmer', v: 0.25},
  {t: 2.3, file: 'slide', v: 0.35},
  {t: 4.84, file: 'whoosh', v: 0.18},
  {t: 9.9, file: 'tick', v: 0.25},
  {t: 14.2, file: 'shimmer', v: 0.32},
  {t: 16.1, file: 'shutter', v: 0.22},
  {t: 18.1, file: 'whoosh', v: 0.2},
  {t: 21.45, file: 'slide', v: 0.25},
  {t: 26.0, file: 'tick', v: 0.2},
  {t: 28.4, file: 'whoosh', v: 0.15},
  {t: 30.7, file: 'tick', v: 0.18},
  {t: 33.25, file: 'tick', v: 0.18},
  {t: 34.45, file: 'tick', v: 0.18},
  {t: 35.35, file: 'tick', v: 0.18},
  {t: 40.15, file: 'reveal', v: 0.2},
  {t: 44.6, file: 'whoosh', v: 0.12},
  {t: 47.4, file: 'reveal', v: 0.32},
  {t: 52.2, file: 'reveal', v: 0.18},
  {t: 56.26, file: 'whoosh', v: 0.16},
  {t: 60.84, file: 'shutter', v: 0.18},
  {t: 64.9, file: 'whoosh', v: 0.14},
  {t: 66.2, file: 'whoosh', v: 0.12},
  {t: 70.2, file: 'shimmer', v: 0.28},
  {t: 82.26, file: 'slide', v: 0.25},
  {t: 85.4, file: 'shimmer', v: 0.16},
  {t: 86.8, file: 'shimmer', v: 0.16},
  {t: 88.6, file: 'shimmer', v: 0.16},
  {t: 99.6, file: 'whoosh', v: 0.14},
  {t: 104.02, file: 'slide', v: 0.2},
  {t: 112.76, file: 'drone', v: 0.55},
  {t: 115.4, file: 'reveal', v: 0.16},
];
