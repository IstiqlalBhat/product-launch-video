# Craft

A vocabulary, not a recipe. Use what serves this film.

## Music first, then the beat grid

The track sets the film's energy and its clock, so choose it before you animate:

- Generate it (`eleven.mjs music`), or use a licensed track. Prompt with genre, BPM, instruments, and structure, for example: "confident minimal electronic, 120 BPM, punchy kick, warm synth bass, 4-bar intro, build to a drop at 0:08, clean resolve at 0:18".
- Measure the grid. `npx hyperframes beats` writes `beats/<audio>.json` for the project's music. `npx hyperframes audio <file> --only beats,downbeats,bpm,sections --json` also reports sections. A beat's frame is `round(seconds × fps)`.
- At 120 BPM, a beat is 15 frames at 30 fps. Change something every one or two beats. Hold only where the viewer must read.
- Put the hook in the first second, build tension, land the money shot (the click and its result) on the drop, and resolve on the end card.

## Motion

- **Easing:** fast arrivals that settle (expo or power4 out), exits that are quicker than entrances, and springs with real mass for UI pieces. Never use one ease for everything.
- **Depth:** CSS perspective with rotateX and rotateY on UI layers, parallax between foreground and background, and a shallow-focus blur on far layers.
- **Motion blur** on fast moves. HyperFrames renders authored page motion blur; in Remotion, use `@remotion/motion-blur`.
- **Kinetic type:** per-letter or per-line staggers, mask reveals, scale and tracking moves. Type is a graphic element, not a caption.
- **Camera:** one continuous camera that moves through the scene, whip pans with blur, and push-ins that ease in and out.
- **Transitions that carry meaning:** a match cut (the button becomes the next shape), a morph, a mask or shape wipe, a zoom-through. A crossfade is a missed idea.
- **Secondary motion:** nothing is ever fully still. Add a slow drift, a light sweep, or grain.
- **Real pieces as actors:** crop real rows, the button, or the toast out of the screenshots and animate them as separate layers. Count up only to numbers that appear on the real screens.

## Art direction

Derive a bold palette from the brand: a full-bleed brand colour, a dark scene against a light one, one accent. Build graphic devices from the logo's shapes. Add texture with restraint: film grain, a vignette, a light leak, a soft glow. Keep one typeface family and use dramatic size contrast.

Generated plates lift a film from a slideshow to a commercial ([FOOTAGE.md](FOOTAGE.md)). Use Higgsfield's image and video models for a hero environment, abstract 3D forms or glass in the brand palette, a slow cinematic camera move, or a texture loop. Prompt with exact hex colours, lens, light, camera move, and duration, and ask for no text and no UI. Pick a few plates and build the film around them: the real UI floats in front of them, lit and graded to match. Generated video comes back at its own frame rate and length, so conform it to the composition's fps and trim it on the beat.

## Ready-made blocks (HyperFrames)

The registry has about 450 editable blocks and components: transitions, kinetic type, titles, overlays, camera moves, 3D, charts.

```bash
npx hyperframes catalog transition --json    # search by words or --tag
npx hyperframes add <name> --no-clipboard     # installs editable source into the project
```

Restyle a block to the brand before you use it. A stock block shipped as is reads as a template.

## Sound

The music carries the film. Spend your effort on a beautiful, production-grade track: a strong prompt, more than one generation if needed, and an edit that respects its phrases (cut on bar lines, and end on the resolve rather than a fade-out). Add an effect only where it makes a moment feel bigger: a soft whoosh into a transition, a low impact on the drop, a riser into the reveal. Mix effects under the music. Never use cartoon UI sounds: no clicks, dings, pops, or ticks. Land each hit on its frame ([AUDIO.md](AUDIO.md#landing-sounds-on-frames)). Duck the music 6 to 10 dB under any voice, and master the mix at about -14 LUFS for social.

## Template looks to avoid

- A centred logo on a grey or blue-purple gradient.
- Everything fading and sliding up by the same amount, on the same ease.
- A floating app window with a drop shadow as the main idea.
- A toast, then a tagline, then the logo, as the whole ending. Or a generic "Try it now on …" end card: the ending should be a designed moment, such as the logo resolving on the music's final beat with the product's own line.
- UI click, ding, and pop sounds stacked over the music.
- Crossfades between scenes, and static holds with nothing alive in them.
- Glow and particles used as decoration.
