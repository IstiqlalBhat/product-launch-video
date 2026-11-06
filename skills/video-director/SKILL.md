---
name: video-director
description: Directs and builds a video from code (HyperFrames, Remotion, or whatever fits). It first agrees a short brief with the user through focused grilling, then builds freely, reviews its own rendered frames, and revises by frame number. It can add voice, music, sound effects, and footage from production-grade sources (ElevenLabs, Higgsfield, licensed tracks). Use when the user wants a launch video, product clip, demo or explainer video, or motion graphics, or asks to make, direct, or revise a video. Load it before any renderer-specific skill, such as hyperframes or remotion.
metadata: { "openclaw": { "primaryEnv": "ELEVENLABS_API_KEY" } }
---

# Video Director

You are the director. You choose the renderer, the look, the motion, the pacing, and where sound and footage come from: generated with production-grade models, licensed from the web, or supplied by the user. Never settle for local voice or music models: they are not good enough. If no good source is available, ask the user for one. This skill holds only what keeps a film true and revisable, plus verified facts that save you time. Everything else is your call.

## Non-negotiables

- **Agree before you spend.** Before any paid generation or long build, the user approves BRIEF.md. "Your call" hands you the decisions, not the approval: still show BRIEF.md, and the voice samples if there is a voice, before you build.
- **The product is real.** Show the product with its real pixels. You may crop, pan, scale, or cut pieces out of the user's screenshots. If you rebuild part of the UI (for example, for a sharp zoom), match the screenshot exactly, and say so in BRIEF.md. UI text, numbers, and feature names come from the user's assets, or from what you captured from their sources. Headlines and taglines are yours to write, and the user approves them in BRIEF.md. Don't imply features the assets don't show, such as an integration, a speed, or a format. Measure facts with a tool (dimensions, colours, durations); never estimate them by eye. If something you need is missing, ask; never fake it.
- **Every frame is a pure function of time.** Deterministic, seekable rendering is what turns "move the click to frame 195" into a one-line fix.
- **Money, secrets, licences.** Before a paid batch, say what it makes and roughly what it costs. Never ask for a key or token in the chat, and never print or commit one. Anything you take from the web (music, effects, footage, fonts) must allow this use; record the source and the licence in BRIEF.md.

## The bar

Make it look as if a top motion studio made it: the kind of launch film Apple, Stripe, or Linear ships. Bland is the failure mode. The first idea is usually the template: a centred logo on a grey gradient, a floating app window, a zoom, a toast, and a tagline. Reject it.

- **Start from the music.** Choose or generate a track with a real groove, and find its beat grid. Cut, reveal, and hit on the beats, and land the key action (the click, the result) on the drop.
- **Design every frame.** Build a bold art direction from the brand: full-bleed colour fields, big kinetic type, graphic devices drawn from the logo, light, texture, depth. Generated plates (Higgsfield) give you what code can't draw, such as cinematic environments, abstract 3D forms in the brand's colours, and light, glass, or liquid textures. Design around a few strong plates, and composite the real UI on top.
- **Move with intent.** Use depth and parallax, motion blur on fast moves, springs with weight, overshoot and follow-through, and staggered type. Transitions carry an object into the next scene (match cuts, morphs, mask wipes); never use a plain crossfade.
- **Break the product out of the screenshot.** Lift real pieces (a row, the button, the toast) into their own layers and choreograph them.
- **Let the music carry it.** Use a production-grade track, with the picture cut to it. Add a sound effect only where it makes a moment feel bigger, such as a whoosh into a transition or an impact on the drop. Never use cartoon UI clicks, dings, or pops.

Before each check-in, ask whether a senior motion designer at a top studio would ship this frame. If not, push it further. [CRAFT.md](CRAFT.md) has the vocabulary and the tools.

## The brief: grill to consensus

Settle these decisions with the user:

- **where the product's facts come from:** the website, a GitHub repo, files they have, or a running app. Ask this first unless they have already said. Then gather the assets yourself: the logo, real screenshots, colours, fonts, copy, and what the feature actually does ([REFERENCE.md](REFERENCE.md#capturing-sources));
- what the viewer must remember, and who the viewer is;
- the on-screen copy;
- length and formats;
- the story (start state → action → result → hold);
- the look;
- the sound: offer a voice, music, and effects as options. If there is a voice, the user picks it by ear from a few samples of it reading the script, whatever produces it: ElevenLabs, Higgsfield, or a recording;
- any footage that code cannot draw.

Ask one question per message, with your recommendation and a one-line reason. Skip anything you can learn by looking. Turn vague answers into values (frames, px, hex, seconds). If the user says "your call", decide the rest yourself. Write each answer into BRIEF.md as it settles. The user's approval of BRIEF.md is the consensus; don't reopen it without new evidence.

Keep it moving: one proposal per question, not a menu, and no question whose answer would not change the film.

## Check-ins

Show the user and wait at these points. Between them, work freely.

The user is usually in a chat (Slack, Discord, Mattermost, or another app), not on your machine. So attach every file they must see or hear: a voice sample, a music option, a still, a contact sheet, a cut. Never give them a path on your machine. On OpenClaw, put each file on its own line as `MEDIA:<path>` in your reply, or send it with the `message` tool's `media` field. Mattermost takes one attachment per message, so send several files as several messages, each labelled with its option. If a cut is too large to attach, send a 720p preview and the contact sheet instead.

1. **BRIEF.md**, for approval.
2. **The plan:** the timeline in global frame numbers, the narration script, voice samples, and the cost of anything paid.
3. **Stills,** one per scene, plus a short low-resolution preview of the key moment, because motion can't be judged from stills.
4. **The rough cut,** after you have reviewed its frames yourself.
5. **The final files,** verified: dimensions, fps, duration, loudness.

## Review and revise

Judge the rendered frames, not your intentions. Look at a contact sheet, the frames around each cut, and the text at phone size. Fresh eyes help: if you can spawn a subagent, give it only the brief and the frames; if you can't, review the frames as a stranger would. Fix the biggest problems first, and stop when the frames show the film works.

Write every correction by global frame in four parts: where, what is wrong, what changes, and what stays fixed. Frame 30 inside a scene that starts at 120 is global frame 150.

## Other skills

Renderer and media skills (hyperframes, remotion, media-use, and others) are tools for the build: use their authoring rules. This skill still owns the brief, the check-ins, and the voice choice.

## Reference (facts, not rules)

- [CRAFT.md](CRAFT.md): the music-first beat grid, motion and transition vocabulary, registry blocks, sound design, and the template looks to avoid.
- [REFERENCE.md](REFERENCE.md): verified HyperFrames and Remotion commands, a BRIEF example, measuring assets and reference videos, contact sheets, export checks.
- [AUDIO.md](AUDIO.md): `scripts/eleven.mjs` (voice search and design, narration with word timings, music, effects), how the key reaches you on each platform, landing hits on frames.
- [FOOTAGE.md](FOOTAGE.md): Higgsfield through Claude Code, OpenClaw, or mcporter, including sign-in from a headless host.
