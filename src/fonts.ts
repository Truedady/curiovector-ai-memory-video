import {continueRender, delayRender, staticFile} from 'remotion';

const FACES: [string, string, string][] = [
  ['CV Display', 'fonts/InterDisplay-Bold.otf', '700'],
  ['CV Display', 'fonts/InterDisplay-ExtraBold.otf', '800'],
  ['CV Display', 'fonts/InterDisplay-Black.otf', '900'],
  ['CV Text', 'fonts/Inter-Medium.otf', '500'],
  ['CV Text', 'fonts/Inter-SemiBold.otf', '600'],
];

let started = false;
export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    FACES.map(([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(file)})`, {weight});
      return face.load().then((loaded) => {
        document.fonts.add(loaded);
      });
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
