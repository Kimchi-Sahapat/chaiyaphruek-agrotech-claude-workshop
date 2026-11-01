# 05 · Tooling decision — how we turn designs into MP4

> Part of the motion research pack ([index](README.md)). Checked Nov 2026 from npm registry metadata and package licence files (vendor websites were blocked by the session proxy).

## Decision

**Own lightweight kit: HTML/CSS + Web Animations API → headless Chromium (Playwright) → ffmpeg.**
`motion/kit/cyp-motion.{js,css}` + `motion/render/render.mjs`. No runtime dependencies, no licence fees, no telemetry, works offline with vendored Kanit. Brand CI, Thai typography rules and platform safe zones are built in and **linted automatically** before every render.

## Options compared

| Option | Licence (verified) | Fit for a 6-person Thai SME using Claude Code | Verdict |
|---|---|---|---|
| **Remotion** 4.0.539 | Source-available. **Free only for individuals, for-profit orgs with ≤ 3 employees, non-profits, or evaluation** (LICENSE.md in the npm package). Otherwise a paid Company License (remotion.pro). | Excellent React-based tool, but **the team has 6 people → needs a paid licence**. | Not chosen (cost + licence admin). Revisit if the team wants React/Remotion Studio. |
| **HyperFrames** (HeyGen) 0.8.x | **Apache-2.0** (npm). Very active (hundreds of 0.8.x releases; pre-1.0 → API churn). | Agent-first HTML→MP4 with lint, preview studio, audio tools. Ships its own opinionated skills (default 1920×1080, its own styles), has **opt-out telemetry** (`HYPERFRAMES_NO_TELEMETRY=1`), upsells HeyGen services. Running it in this cloud session was blocked by the safety classifier ("code from external"), so it is **untested here**. | Good alternative. Our compositions use the same idea (paused, seekable timeline), so migrating later is easy. |
| **GSAP** 3.15 | "Standard 'no charge' licence" (free incl. plugins since the Webflow acquisition; licence restricts building competing visual animation tools). | Industry standard, great API; SplitText needs Thai fixes (see research/01 §4g). | Not needed — WAAPI covers our moves; can be added later. |
| Motion Canvas 3.17 | MIT | Last npm update Feb 2025 — looks stagnant. | No. |
| Revideo 0.11 | MIT | Fork of Motion Canvas for programmatic rendering; small community. | No. |
| Lottie (lottie-web 5.13) | MIT | For After Effects designers (Bodymovin export). | Use if an agency delivers AE work; the kit can host a Lottie layer later. |
| CapCut / Canva / After Effects | Commercial apps | What the content team already uses for live footage. | Keep for footage editing; **use the skill's storyboard/motion spec as the brief** for those tools too. |

## Verified in this repo [tested]
- Headless Chrome 153 renders Kanit (all 4 weights) deterministically; WAAPI animations are paused and seeked per frame; output 1080×1920 H.264 yuv420p 30 fps + AAC 48 kHz.
- Render speed: ≈ 0.11 s/frame via CDP JPEG capture → a 20-s reel renders in about 1 minute.
- Thai findings that shaped the kit: ICU word segmentation errors on brand/agri terms; mask clipping of stacked tone marks; `paint-order: stroke fill` needed for white outlines (research/01 §4).
- Flash screen (luma-based) and loudness mastering run inside the renderer.

## Voice-over options (for later)
- Licensed TTS with Thai: Azure AI Speech (th-TH Premwadee/Niwat/Achara Neural — SSML for pronunciation), Google Cloud TTS (Neural2 / Chirp 3 HD / Gemini-TTS), Botnoi Voice (Thai-native). See research/04 §6.
- **edge-tts** (used by some free community skills) calls Microsoft Edge's *read-aloud* service through an unofficial client — the voices are the same family as Azure's, but it is **not a commercial API**; for business ads use the official Azure Speech service instead. ⚠️ our reading of the service terms — confirm before relying on it.
- When a VO exists, drive animation timing from a **cue sheet** (timestamps per phrase — from TTS word boundaries or marked by hand in an audio editor); the kit's scene/`at` times map 1:1 to it.

## Related skills seen in this workspace
The `genhaha-*` skills (kinetic cards, brand promo, presenter explainer, stickman…) are generic Thai video templates built on HyperFrames + edge-tts. Useful prior art (VO word timing), but their looks conflict with our CI (e.g., black cards, white flashes, shake) — **for Chaiyapreuk content use the `motion-graphics` skill in this repo**, or restyle carefully and re-check CI.
