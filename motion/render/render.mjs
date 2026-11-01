#!/usr/bin/env node
/* =====================================================================
   Render a cyp-motion composition (one .html file) to MP4 / stills.
   Deterministic: seeks the paused timeline frame by frame, grabs each
   frame from headless Chromium (CDP) and pipes it into ffmpeg (H.264).

   node motion/render/render.mjs <comp.html> [options]
     --out <file.mp4>      default: motion/out/<name>.mp4
     --lint                only run the CI/readability check (exit 1 on errors)
     --no-lint             skip the pre-render check
     --force               render even if the check reports errors
     --sheet [n]           contact sheet of n evenly spaced frames (default 12)
     --stills t1,t2,...    PNG frames at those times (seconds)
     --from <s> --to <s>   render only a time range
     --scale <f>           e.g. 0.5 for a fast low-res draft
     --audio <file>        music / voice-over bed (else uses M.music(); else silent)
     --no-sfx              don't synthesise the SFX cues (M.sfx / M.cut)
     --crf <n>             x264 quality, lower = better (default 18)
   Needs: Node 18+, ffmpeg, Playwright + Chromium (preinstalled in Claude Code
   cloud sessions; elsewhere: npm i -g playwright && npx playwright install chromium)
   ===================================================================== */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
let chromium;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) {
  try { ({ chromium } = require(p)); break; } catch { /* try next */ }
}
if (!chromium) { console.error('✗ Playwright not found → npm i -g playwright && npx playwright install chromium'); process.exit(2); }

/* ---------- args ---------- */
const argv = process.argv.slice(2);
const flag = (k) => argv.includes(k);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const file = argv.find((a) => a.endsWith('.html'));
if (!file || !existsSync(file)) { console.error('usage: node motion/render/render.mjs <comp.html> [--out x.mp4] [--lint] [--sheet 12] ...'); process.exit(2); }
const name = basename(file, extname(file)) === 'index' ? basename(dirname(resolve(file))) : basename(file, extname(file));
const out = resolve(opt('--out', join(HERE, '..', 'out', `${name}.mp4`)));
mkdirSync(dirname(out), { recursive: true });
const scale = +opt('--scale', 1), crf = opt('--crf', '18');

const run = (cmd, args, input) => new Promise((ok, bad) => {
  const p = spawn(cmd, args, { stdio: [input ? 'pipe' : 'ignore', 'ignore', 'pipe'] });
  let err = ''; p.stderr.on('data', (d) => { err += d; });
  p.on('close', (c) => (c === 0 ? ok() : bad(new Error(`${cmd} exited ${c}\n${err.slice(-2000)}`))));
  if (input) Promise.resolve(input(p.stdin)).catch((e) => { p.kill(); bad(e); });
});

/* ---------- open composition ---------- */
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: scale });
page.on('pageerror', (e) => console.error('  page error:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.error('  console:', m.text()); });
await page.addInitScript(() => { window.__CYP_RENDER = true; });
await page.goto(pathToFileURL(resolve(file)).href + '?render');
await page.waitForFunction(() => window.__CYP && window.__CYP.ready, null, { timeout: 30000 })
  .catch(() => { console.error('✗ composition never called M.done() — is cyp-motion.js loaded?'); process.exit(1); });
await page.evaluate(() => window.__CYP.ready);
const meta = await page.evaluate(() => ({ w: __CYP.width, h: __CYP.height, fps: __CYP.fps, dur: __CYP.duration, cues: __CYP.cues, audio: __CYP.audio, mode: __CYP.mode }));
await page.setViewportSize({ width: meta.w, height: meta.h });
const fps = +opt('--fps', meta.fps);
console.log(`▶ ${name}: ${meta.w}×${meta.h} @${fps}fps, ${meta.dur}s, mode=${meta.mode}`);

/* ---------- lint ---------- */
if (!flag('--no-lint')) {
  const r = await page.evaluate(() => __CYP.lint());
  r.errors.forEach((e) => console.log('  ✗', e));
  r.warnings.forEach((w) => console.log('  !', w));
  console.log(`  check: ${r.errors.length} error(s), ${r.warnings.length} warning(s) · weights ${r.weights.join('/')}`);
  if (flag('--lint')) { await browser.close(); process.exit(r.errors.length ? 1 : 0); }
  if (r.errors.length && !flag('--force')) { console.error('✗ fix errors or pass --force'); await browser.close(); process.exit(1); }
}

// Frame grab via CDP (much faster than page.screenshot; JPEG q95 is visually lossless before x264)
const cdp = await page.context().newCDPSession(page);
const grab = async (fmt = 'jpeg') => Buffer.from((await cdp.send('Page.captureScreenshot', {
  format: fmt, quality: fmt === 'jpeg' ? 95 : undefined, optimizeForSpeed: true, captureBeyondViewport: false,
  clip: { x: 0, y: 0, width: meta.w, height: meta.h, scale: 1 },
})).data, 'base64');
const shot = async (t, fmt) => { await page.evaluate((x) => __CYP.seek(x), t); return grab(fmt); };

/* ---------- stills + contact sheet ---------- */
const stills = opt('--stills');
if (stills) for (const t of stills.split(',').map(Number)) {
  const p = out.replace(/\.mp4$/, `-t${t.toFixed(2)}.png`); writeFileSync(p, await shot(t, 'png')); console.log('  still', p);
}
if (flag('--sheet')) {
  const n = +opt('--sheet', 12) || 12, times = Array.from({ length: n }, (_, i) => +((meta.dur * (i + 0.5)) / n).toFixed(2));
  const imgs = [];
  for (const t of times) imgs.push({ t, src: 'data:image/png;base64,' + (await shot(t, 'png')).toString('base64') });
  const cols = Math.min(6, n), tw = meta.h > meta.w ? 300 : 360, th = Math.round((tw * meta.h) / meta.w);
  const sheet = await browser.newPage({ viewport: { width: cols * (tw + 12) + 12, height: Math.ceil(n / cols) * (th + 44) + 12 } });
  await sheet.setContent(`<body style="margin:0;padding:6px;background:#fff;font:600 18px system-ui;display:flex;flex-wrap:wrap">${imgs.map((i) => `<figure style="margin:6px;width:${tw}px"><img src="${i.src}" style="width:${tw}px;height:${th}px;display:block;outline:1px solid #ccc"><figcaption style="text-align:center;padding-top:6px">${i.t.toFixed(2)}s</figcaption></figure>`).join('')}</body>`);
  const p = out.replace(/\.mp4$/, '-sheet.png'); await sheet.screenshot({ path: p, fullPage: true }); console.log('  sheet', p);
}
if (stills || flag('--sheet')) if (!flag('--video')) { await browser.close(); process.exit(0); }

/* ---------- audio: SFX cues (synthesised, royalty-free) + optional bed ---------- */
const SFX = { // ffmpeg lavfi sources — short, soft, brand-friendly
  pop: 'aevalsrc=0.5*sin(2*PI*t*(520+900*exp(-t*38)))*exp(-t*22):s=48000:d=0.18',
  tick: 'aevalsrc=0.3*sin(2*PI*2400*t)*exp(-t*140):s=48000:d=0.05',
  thud: 'aevalsrc=0.8*sin(2*PI*t*(70+90*exp(-t*30)))*exp(-t*14):s=48000:d=0.35',
  ding: 'aevalsrc=0.28*(sin(2*PI*1318.5*t)+0.6*sin(2*PI*1975.5*t)+0.3*sin(2*PI*2637*t))*exp(-t*4.5):s=48000:d=0.9',
  swish: 'anoisesrc=color=pink:amplitude=0.5:duration=0.36:sample_rate=48000,bandpass=f=2200:width_type=o:w=1.6,afade=t=in:d=0.2:curve=qsin,afade=t=out:st=0.2:d=0.16:curve=qsin',
  whoosh: 'anoisesrc=color=brown:amplitude=0.7:duration=0.6:sample_rate=48000,lowpass=f=1400,afade=t=in:d=0.32:curve=qsin,afade=t=out:st=0.32:d=0.28:curve=qsin',
};
const bed = opt('--audio') || (meta.audio[0] && resolve(dirname(resolve(file)), meta.audio[0].src));
const cues = flag('--no-sfx') ? [] : meta.cues.filter((c) => SFX[c.name] && c.at >= 0 && c.at < meta.dur);
let mix = null;
if (bed || cues.length) {
  mix = join(tmpdir(), `cyp-mix-${process.pid}.wav`);
  const a = ['-y', '-loglevel', 'error'], parts = [], labels = [];
  let idx = 0;
  if (bed) { a.push('-i', bed); parts.push(`[0:a]aresample=48000,loudnorm=I=-16:TP=-2:LRA=11,volume=${meta.audio[0]?.volume ?? 1}[bed]`); labels.push('[bed]'); idx = 1; }
  cues.forEach((c, i) => {
    a.push('-f', 'lavfi', '-i', SFX[c.name]);
    const ms = Math.round(c.at * 1000);
    parts.push(`[${idx + i}:a]aformat=channel_layouts=mono,adelay=${ms}:all=1,volume=${(bed ? 0.5 : 0.8) * c.gain}[s${i}]`); labels.push(`[s${i}]`);
  });
  // with a music/VO bed: master to −14 LUFS, true peak ≤ −1.5 dBTP (social/streaming norm, research/02 §5)
  const master = bed ? 'loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,' : '';
  parts.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=longest,aformat=channel_layouts=stereo,apad,atrim=0:${meta.dur},${master}alimiter=limit=0.84:level=false[out]`);
  a.push('-filter_complex', parts.join(';'), '-map', '[out]', '-ar', '48000', mix);
  await run('ffmpeg', a);
  console.log(`  audio: ${bed ? 'bed + ' : ''}${cues.length} sfx cue(s)`);
}

/* ---------- frames → ffmpeg ---------- */
const from = +opt('--from', 0), to = Math.min(+opt('--to', meta.dur), meta.dur);
const total = Math.round((to - from) * fps);
const vargs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
if (mix) vargs.push('-ss', String(from), '-i', mix);
vargs.push('-c:v', 'libx264', '-preset', 'medium', '-crf', crf, '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(fps));
if (mix) vargs.push('-c:a', 'aac', '-b:a', '192k', '-ar', '48000');
vargs.push('-t', String(to - from), '-movflags', '+faststart', out);
const started = Date.now();
// poster / thumbnail: LINE OA auto-thumbnails the frame at 1 s and needs a preview image of the same ratio
if (from === 0) {
  await page.evaluate((x) => __CYP.seek(x), Math.min(1, meta.dur));
  const poster = out.replace(/\.mp4$/, '-poster.jpg');
  await page.screenshot({ path: poster, type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: meta.w, height: meta.h } });
  console.log('  poster', poster);
}
await run('ffmpeg', vargs, async (stdin) => {
  for (let f = 0; f < total; f++) {
    const buf = await shot(from + f / fps);
    if (!stdin.write(buf)) await new Promise((r) => stdin.once('drain', r));
    if (f % fps === 0) process.stdout.write(`\r  frame ${f}/${total}`);
  }
  stdin.end();
});
await browser.close();
if (mix) rmSync(mix, { force: true });
console.log(`\r✓ ${out}  (${total} frames in ${((Date.now() - started) / 1000).toFixed(1)}s)`);

/* ---------- flash screen (coarse; NOT a substitute for EA IRIS / Harding) ----------
   WCAG 2.3.1: ≤ 3 flashes in any 1 s. A "flash" here = a pair of opposing jumps in average
   luma ≥ 20/255 within 3 frames. Full-frame average misses small flashing areas and red flashes. */
const luma = await new Promise((ok) => {
  const p = spawn('ffmpeg', ['-hide_banner', '-i', out, '-vf', 'scale=270:-2,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'ignore'] });
  let s = ''; p.stdout.on('data', (d) => { s += d; }); p.on('close', () => ok([...s.matchAll(/YAVG=([\d.]+)/g)].map((m) => +m[1])));
});
const jumps = [];
for (let i = 3; i < luma.length; i++) {
  const d = luma[i] - luma[i - 3];
  if (Math.abs(d) >= 20 && (!jumps.length || i - jumps.at(-1).i > 2 || Math.sign(d) !== jumps.at(-1).dir)) jumps.push({ i, dir: Math.sign(d) });
}
let worst = 0;
for (const j of jumps) worst = Math.max(worst, Math.floor(jumps.filter((k) => k.i >= j.i && k.i < j.i + fps).length / 2));
console.log(worst > 3 ? `  ✗ flash screen: up to ${worst} flashes in 1 s (WCAG 2.3.1 allows 3) — slow it down` : `  flash screen: ok (max ${worst} flash/s, ${jumps.length} big luma jumps)`);
