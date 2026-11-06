# Video Director: reference

## Setup

You need Node.js (22 or later for HyperFrames), FFmpeg, and FFprobe.

**HyperFrames** (Apache 2.0, so there is no licence limit for client work):

```bash
HYPERFRAMES_SKIP_SKILLS=1 npx hyperframes init <name> --example blank --resolution square --non-interactive
npx hyperframes preview                      # studio with live reload
```

Without `HYPERFRAMES_SKIP_SKILLS=1`, `init` installs HyperFrames' own skills into the user's skill folders (`~/.agents/skills`, Claude Code's `skills/`, and `~/.openclaw/skills`). On a shared host, that changes the skills of every agent. Install them only when the user asks you to.

HyperFrames needs about 4 GB of free memory for `check`, `snapshot`, and `render`. If Chrome is killed, lower the sample counts or the workers (`-w 1`) before you look for other causes.

A composition is HTML. Timed elements carry `class="clip"`, `data-start`, and `data-duration`, in **seconds**. Convert from BRIEF frames: seconds = frame ÷ fps (frame 195 at 30 fps = 6.5). Animate with a paused GSAP timeline that is registered on `window.__timelines["<composition-id>"]`, and place each tween at an absolute time: `tl.to(el, vars, 6.5)`. For full details, run `npx hyperframes docs gsap` or `npx hyperframes docs data-attributes`.

**Remotion** (when the project already uses it, or needs React or 3D components):

```bash
npx create-video@latest --yes --blank <name>
cd <name> && npx remotion skills add   # installs Remotion's agent skills for the user; ask first on a shared host
npm run dev                            # live preview
```

Remotion's license: it is free for individuals and for companies of up to 3 people. Client work counts the combined headcount of everyone who collaborates. Read https://www.remotion.dev/docs/license/faq before the first paid job.

## Capturing sources

**A website.** `npx hyperframes capture <url> -o capture --json --skip-vision` loads the site in Chrome and saves screenshots, its images and SVGs (logo included), and each section as an editable HyperFrames component. `--skip-vision` stops it from sending images to an AI captioning service. For a sharp zoom, take extra screenshots at device scale factor 2 with headless Chrome (`--force-device-scale-factor=2 --window-size=1440,900 --screenshot=<file> <url>`). Take colours and font families from the site's CSS; don't guess them. Record each asset's source URL in BRIEF.md.

**A GitHub repo.** Clone it with `gh repo clone <owner/repo>` or `git clone`. If it is private, ask the user for access. Find the feature in the README, the CHANGELOG, `git log`, the routes, and the components. The code tells you what the feature does; it does not show what it looks like. So use real screenshots: run the app, use screenshots the repo already contains, or capture the live site. Never draw a screen from code alone.

**A running app.** Log in only with credentials that the user provides through the platform's secret mechanism ([AUDIO.md](AUDIO.md#the-key) has the pattern). Capture the real screens.

## Measuring assets

Facts go into BRIEF.md measured, not estimated:

```bash
ffprobe -v error -show_entries stream=width,height -of csv=p=0 public/screens/report.png      # size in px
ffmpeg -v error -i public/screens/report.png -vf "crop=1:1:40:600" -f rawvideo -pix_fmt rgb24 - | od -An -tx1   # colour at x40 y600
```

## BRIEF.md example

An example shape. Keep the sections that help this film, and add any it needs.

```text
GOAL
Remember: [one sentence]. Viewer: [who].
Opening copy: [max 8 words]. Closing copy: [one action + where].

FACTS (from the product only; never invent screens, logos, or numbers)
Logo: public/logo.svg   Screens: public/screens/*.png   Font: [family, file]
Approved copy and metrics: [text]

DELIVERY
Renderer: HyperFrames | Remotion. Composition "Launch", 1080x1080, 30 fps, 600 frames. Frames are global and inclusive.
Variants: [for example "LaunchVertical" 1080x1920, its own layout], or none.

LOOK
Tokens: background #101318, text #F5F7FA, accent #8AD8B0. Type: [family, weights, sizes].
Layout: origin top-left, px. 64px margin. Headline box x96 y112 w888, max 2 lines.
Card x120 y350 w840 h480. Layer order: background, card, product, cursor, headline.
Motion: micro UI snaps (little overshoot); panels settle; camera slow; headlines fast in, then hold.
Reference: [file]. Borrow only [one job]. Avoid: centred big text on a gradient, everything fading in, [more].

TIMELINE (global frames, 30 fps)
0-18     headline in (y 24→0, opacity 0→1)
18-42    card in (y 60→0, opacity 0→1), cubic ease-out, clamped
150-180  cursor to the Export anchor; path stays clear of text
195      press: cursor scale 1→0.92→1 by 201; button responds
210-234  file appears; fully readable by 234; held through 419
420-599  logo and closing copy; fade 420-438; hold

SOUND (cue list, global frames)
195 click | 210 reveal accent | 438 music settles
Narration: [none | voice name + voice_id]; script in narration/*.txt
Music: [prompt, length]. Mix: final master at -16 LUFS.

FOOTAGE
[none | shot, Higgsfield model, prompt file, length, job id]

REVIEW
Stills at: [one frame per scene]. A contact sheet for each rough cut.
```

Timing rules:

- Start the reading window when the words become legible. The hold must be at least as long as it takes to read the label aloud at normal speed.
- Before the motion pass, test the layout with the longest headline the client might use, in the real font. If the headline wraps to 3 lines, shorten it, widen its box, or move part of it to its own shot.
- Each beat needs an entry state, an exit state, and a reason to exist. If you cannot say why a shot exists, remove it.

## Reference analysis

Use this only if the user gives a reference. Borrow timing decisions from it, not its layout, copy, or subjects.

```bash
ffprobe -v error -show_entries stream=width,height,avg_frame_rate -show_entries format=duration -of json reference.mp4
mkdir -p frames && ffmpeg -i reference.mp4 -vf "fps=2,scale=960:-2" frames/ref-%04d.jpg
```

In REFERENCE.md, record:

- The frame numbers of the entrance, landing, hold, and cut.
- The bounding box of the main object at the start and at the landing.
- The direction of each move, its duration, any change in scale or opacity, and any overshoot.
- The order in which the elements appear, and how long the result stays readable.

Label every value as **measured**, **estimated**, or **proposed**. Spatial estimates from an image are approximate, so check a coordinate against the frame before you put it in BRIEF.md. Convert frame rates: a half-second move is 15 frames at 30 fps but 30 frames at 60 fps.

## Review commands

HyperFrames (times in seconds):

```bash
npx hyperframes check --at-transitions --json                     # overlap, overflow, contrast, runtime errors
npx hyperframes snapshot --at 2,8,18 --no-end -o out/stills --describe false   # one still per scene
npx hyperframes snapshot --range 3,5 --frames 12 -o out/cut --describe false   # a cut boundary only
npx hyperframes snapshot --review -o reviews/r1 --describe false  # contact sheet, cut strips, phone-width frames
```

Always pass `--describe false`: without it, `snapshot` sends frames to Gemini whenever `GEMINI_API_KEY` is set. Fix every error that `check` reports before you show stills to the user.

Remotion (frames):

```bash
npx remotion still Launch out/s1.png --frame=60                  # one still per scene
npx remotion render Launch out/cut.mp4 --frames=90-149           # a cut boundary only
npx remotion render Launch out/preview.mp4
mkdir -p reviews && ffmpeg -y -i out/preview.mp4 -vf "fps=1,scale=360:-2,tile=5x4" -frames:v 1 reviews/contact-r1.png
```

This contact sheet shows one frame per second, so 20 tiles cover 20 s. For a longer film, lower the fps value or enlarge the tile grid.

Contact sheet checklist:

- [ ] Text is readable at phone size.
- [ ] No element crosses the safe area.
- [ ] Only real product assets appear, not invented replacements.
- [ ] Type and colour stay the same across scenes.
- [ ] No mid-transition frame looks awkward.
- [ ] Cuts and sound cues land together.
- [ ] The first 2 s contain a real hook.
- [ ] The last frame is strong enough to be a poster.

## Critic

The builder grades its own work too kindly. If you can spawn a subagent, give it only BRIEF.md, the contact sheet, and the stills, with a prompt like this one:

```text
Judge only the rendered frames, not what anyone intended.
Inputs: BRIEF.md, reviews/contact-rN.png, out/s*.png.
Score from 1 to 5: hook, readability, continuity, motion, sound sync (if BRIEF lists audio cues).
Return the defects that matter most, worst first. For each defect, give the global frames,
the evidence you can see, and a local fix: where, what is wrong, what changes, what stays fixed.
```

If you can't spawn one, review the frames yourself with the same prompt, as a stranger would. Check each reported defect against the frame before you fix it: critics sometimes report defects that are not there. A frame that passes every check but still feels wrong is the user's call.

## Deliver

```bash
npx hyperframes render -o out/launch.mp4 -q delivery    # or: npx remotion render Launch out/launch.mp4 --codec=h264
ffmpeg -y -i out/launch.mp4 -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 192k out/launch-final.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate -show_entries format=duration -of json out/launch-final.mp4
npx hyperframes snapshot --at <approved second> --no-end -o out/poster --describe false   # or: npx remotion still Launch out/poster.png --frame=<approved frame>
```

Each export must match BRIEF.md DELIVERY, for example 1080x1080, 30/1, and 20.0 s. Repeat these steps for each variant composition (HyperFrames: `render -c compositions/<variant>.html`). Watch each file once at normal speed. Listen once on headphones and once on a phone speaker: a click that is clear on headphones can disappear on a phone.

Keep the approved render with its BRIEF.md. Copy reusable components (entrances, cursor, text blocks) to a shared folder, so that the next film starts from them.
