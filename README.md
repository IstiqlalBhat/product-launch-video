# product-launch-video

**Your coding agent makes the launch video for your app.** Point it at your website, repo, or running app, and get a short launch film in the style of Apple, Stripe, or Linear: cut to music, built from your product's real screens, and rendered from code. Not a template with your logo on a grey gradient.

<p align="center">
  <a href="demo/supabase-hidden-half.mp4"><img src="demo/supabase-hidden-half.gif" width="720" alt="An iceberg split at the waterline: the app on its tip above the water, a much larger hidden mass below"></a>
</p>
<p align="center">
  <b><a href="demo/supabase-hidden-half.mp4">▶ Watch the full 40-second film, with sound</a></b><br>
  <sub>"The Hidden Half", an unofficial Supabase launch film made with this skill in Claude Code. Not affiliated with Supabase.</sub>
</p>

It does one job: launch videos, feature announcements, and promo clips for software products. It is not built for tutorials, vlogs, or long explainers.

`product-launch-video` is an [Agent Skill](https://agentskills.io) for Claude Code, OpenClaw, and any agent that loads `SKILL.md` skills. It works with [HyperFrames](https://github.com/heygen-com/hyperframes), [Remotion](https://www.remotion.dev), or whatever renderer fits the job.

```text
> make a 30-second launch video for example.com
```

## What it does

1. **Grills you to a brief.** One question at a time, each with a recommendation: what the viewer must remember, the story, the look, the sound. Everything settles into `BRIEF.md`, and nothing paid runs until you approve it.
2. **Uses your real product.** It captures your logo, screenshots, colours, fonts, and copy from your site, repo, or files. It never invents UI, numbers, or features.
3. **Starts from the music.** It finds the beat grid, cuts on the beats, and lands the key moment on the drop.
4. **Builds like a studio.** Kinetic type, depth and parallax, match cuts and mask wipes, real UI lifted out of the screenshot and choreographed, plus generated plates for what code can't draw.
5. **Watches its own output.** It reviews the rendered frames (contact sheets, frames around each cut, text at phone size), then fixes problems by global frame number, so "move the click to frame 195" is a one-line change.
6. **Checks in at the points that matter.** Brief, plan with costs, stills, rough cut, and final files verified for dimensions, fps, duration, and loudness.

## Sound and footage

- **Voice, music, effects** through ElevenLabs, with a bundled zero-dependency script ([`scripts/eleven.mjs`](skills/product-launch-video/scripts/eleven.mjs)): voice search and design, narration with per-word frame timings, music, and sound effects. You pick the voice by ear from samples that read your actual script.
- **Generated footage** through Higgsfield's MCP server (OAuth, works from headless hosts too).
- **Licensed tracks and stock**, with each file's source and licence recorded in the brief.

No local TTS or music models: they aren't good enough for a launch film.

## Install

```bash
npx skills@latest add IstiqlalBhat/product-launch-video
```

Or copy [`skills/product-launch-video`](skills/product-launch-video) into your agent's skills folder (for Claude Code, `~/.claude/skills/`; on OpenClaw, any folder in `skills.load.extraDirs`).

**Needs:** Node 18+ and ffmpeg. The renderer (HyperFrames or Remotion) is installed per project when the video is built.

## Keys and sign-ins

Both are optional; without them the skill builds silent, code-only films or asks you for files.

- **ElevenLabs:** `ELEVENLABS_API_KEY` in the environment, or in a `.env` in the project (or any folder above it), `~/.config/product-launch-video/.env`, or `~/.openclaw/.env`. The skill never asks for the key in chat. See [AUDIO.md](skills/product-launch-video/AUDIO.md#the-key).
- **Higgsfield:** its MCP server with OAuth. See [FOOTAGE.md](skills/product-launch-video/FOOTAGE.md).

Check the helper without a key: `node skills/product-launch-video/scripts/eleven.mjs selftest`.

## What's inside

| File | Holds |
|---|---|
| [SKILL.md](skills/product-launch-video/SKILL.md) | The non-negotiables, the quality bar, the brief, check-ins, and the review loop |
| [CRAFT.md](skills/product-launch-video/CRAFT.md) | Beat grids, motion and transition vocabulary, sound design, template looks to avoid |
| [REFERENCE.md](skills/product-launch-video/REFERENCE.md) | Verified HyperFrames and Remotion commands, a BRIEF example, contact sheets, export checks |
| [AUDIO.md](skills/product-launch-video/AUDIO.md) | The ElevenLabs helper, how the key reaches the agent, landing hits on frames |
| [FOOTAGE.md](skills/product-launch-video/FOOTAGE.md) | Higgsfield via Claude Code, OpenClaw, or mcporter, and placing clips on frames |

The skill keeps only rules that protect the film (real product pixels, approval before spend, deterministic frames, licences) and facts verified in real runs. Every creative decision is left to the model.

## How the demo was made

The film at the top was made with this skill in Claude Code. The skill agreed the story with a person (every app has a half you see and a hidden half, and Supabase is the hidden half), had them pick the narrator and the music by ear, and generated both with ElevenLabs: the music in timed sections around the script, the narration cut so its key words land on the beats. It built the ocean, the iceberg and the globe in Three.js inside HyperFrames, showed the real Supabase dashboard (filled with demo data) as flat screens, and reviewed its own rendered frames before each check-in. Sources: Supabase Studio screens (Apache-2.0), Natural Earth land data (public domain), three.js (MIT), Manrope and Inter fonts (OFL). Supabase's name and logo belong to Supabase.

## Contributing

Issues and PRs are welcome — especially verified facts for other renderers, platforms, or media sources. Please keep additions to protective rules or tested facts, not step-by-step recipes.

## License

[MIT](LICENSE)
