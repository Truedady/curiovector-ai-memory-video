import {Config} from '@remotion/cli/config';
import fs from 'fs';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
Config.setChromiumOpenGlRenderer('swangle');

// Use a locally installed headless Chromium when present (cloud containers);
// otherwise Remotion downloads its own.
const localShell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(localShell)) {
  Config.setBrowserExecutable(localShell);
}
