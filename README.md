# video-director

**Turn your coding agent into a motion director.** Ask for a launch film, a product clip, or an explainer, and get a finished video rendered from code — not a template with your logo on a grey gradient.

`video-director` is an [Agent Skill](https://agentskills.io) for Claude Code, OpenClaw, and any agent that loads `SKILL.md` skills. It works with [HyperFrames](https://github.com/heygen-com/hyperframes), [Remotion](https://www.remotion.dev), or whatever renderer fits the job.

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

- **Voice, music, effects** through ElevenLabs, with a bundled zero-dependency script ([`scripts/eleven.mjs`](skills/video-director/scripts/eleven.mjs)): voice search and design, narration with per-word frame timings, music, and sound effects. You pick the voice by ear from samples that read your actual script.
- **Generated footage** through Higgsfield's MCP server (OAuth, works from headless hosts too).
- **Licensed tracks and stock**, with each file's source and licence recorded in the brief.

No local TTS or music models: they aren't good enough for a launch film.

## Install

```bash
npx skills@latest add IstiqlalBhat/video-director
```

Or copy [`skills/video-director`](skills/video-director) into your agent's skills folder (for Claude Code, `~/.claude/skills/`; on OpenClaw, any folder in `skills.load.extraDirs`).

**Needs:** Node 18+ and ffmpeg. The renderer (HyperFrames or Remotion) is installed per project when the video is built.

## Keys and sign-ins

Both are optional; without them the skill builds silent, code-only films or asks you for files.

- **ElevenLabs:** `ELEVENLABS_API_KEY` in the environment, or in a `.env` in the project (or any folder above it), `~/.config/video-director/.env`, or `~/.openclaw/.env`. The skill never asks for the key in chat. See [AUDIO.md](skills/video-director/AUDIO.md#the-key).
- **Higgsfield:** its MCP server with OAuth. See [FOOTAGE.md](skills/video-director/FOOTAGE.md).

Check the helper without a key: `node skills/video-director/scripts/eleven.mjs selftest`.

## What's inside

| File | Holds |
|---|---|
| [SKILL.md](skills/video-director/SKILL.md) | The non-negotiables, the quality bar, the brief, check-ins, and the review loop |
| [CRAFT.md](skills/video-director/CRAFT.md) | Beat grids, motion and transition vocabulary, sound design, template looks to avoid |
| [REFERENCE.md](skills/video-director/REFERENCE.md) | Verified HyperFrames and Remotion commands, a BRIEF example, contact sheets, export checks |
| [AUDIO.md](skills/video-director/AUDIO.md) | The ElevenLabs helper, how the key reaches the agent, landing hits on frames |
| [FOOTAGE.md](skills/video-director/FOOTAGE.md) | Higgsfield via Claude Code, OpenClaw, or mcporter, and placing clips on frames |

The skill keeps only rules that protect the film (real product pixels, approval before spend, deterministic frames, licences) and facts verified in real runs. Every creative decision is left to the model.

## Contributing

Issues and PRs are welcome — especially verified facts for other renderers, platforms, or media sources. Please keep additions to protective rules or tested facts, not step-by-step recipes.

## License

[MIT](LICENSE)
