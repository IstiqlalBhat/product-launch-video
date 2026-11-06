# Audio

Use any source that sounds right and allows this use: ElevenLabs (below), Higgsfield if its tool list includes music or sound models ([FOOTAGE.md](FOOTAGE.md#higgsfield-access)), music or effects found on the web under a licence that permits it, or the user's files. Don't use local voice or music models; they are not good enough. If no good source is set up, ask the user for one. Generate more than one option for the music, and pick by ear: let the user hear them. Record each file's source and licence in BRIEF.md.

## ElevenLabs

`scripts/eleven.mjs` wraps the calls that video work repeats. Run it from the project root:

```bash
node <skill-dir>/scripts/eleven.mjs <command> ...
```

| Command | Does |
|---|---|
| `check` | Reports whether the key is set and valid, and the credits left. Never prints the key. |
| `voices <words...>` | Lists up to 10 voices whose name, labels, or description contain every word; saves previews to `out/voices/`. |
| `design "<description>"` | Designs 3 new voices from a description; saves previews to `out/voices/design-N.mp3`. |
| `keep <generated_voice_id> "<name>" "<description>"` | Saves a designed voice and prints its `voice_id`. |
| `tts <voice_id> <text-file> <out.mp3>` | Narration, plus `<out>.words.json`: each word's start and end in seconds, and `f`, its start frame from the clip start (`--fps=` to change). |
| `sfx "<prompt>" <seconds> <out.mp3>` | A sound effect, 0.5 to 30 s. |
| `music "<prompt>" <seconds> <out.mp3>` | Instrumental music. |

Models: speech `eleven_v4`, voice design `eleven_ttv_v3`, music `music_v2_5`, effects `eleven_text_to_sound_v3`. If a model id is rejected, list the current models with `GET /v1/models`. If an output file already exists, the script skips that call and spends nothing; `--force` regenerates it. Voice previews are free; narration, music, and effects use credits.

When there is a voice, let the user hear each shortlisted voice read a line of the actual script, with the brand names pronounced as the user says them, before you generate the full narration. The stock previews are only 2 to 3 seconds of generic text, too little to judge a voice that must sell. One line per voice costs about 100 credits. Search first, and design voices if none fits. Spell words the way they must sound ("Kubernetes" read as a brand name, not "K-eight-S" read as letters). The user approves the script before you generate it.

## The key

The script reads `ELEVENLABS_API_KEY` from its environment. If the environment doesn't have it, the script takes it from the first of these files that contains it: a `.env` in the working directory or any directory above it, then `~/.config/product-launch-video/.env`, then `~/.openclaw/.env`. It reads only that one key from those files. If `check` says the key is missing, tell the user how to provide it on the platform you are running on. Never let the value pass through the chat.

- **Any host with a project `.env`:** the user adds `ELEVENLABS_API_KEY=...` to the `.env` of the project or workspace, and the script finds it when you run it from inside that folder.
- **OpenClaw, self-hosted:** the operator puts the key in `~/.openclaw/.env`, and the script reads it at once (the gateway itself reads that file only when it starts). Or the operator sets `skills.entries.product-launch-video.apiKey` in `openclaw.json`, because this skill declares `ELEVENLABS_API_KEY` as its `primaryEnv`. A SecretRef works there, and it applies from the next run.
- **Claude Code:** the user copies the key and types this in the prompt; the key goes from the clipboard into the file without appearing in the chat:
  `! (umask 077; mkdir -p ~/.config/product-launch-video && printf 'ELEVENLABS_API_KEY=%s\n' "$(pbpaste)" > ~/.config/product-launch-video/.env)`

An authentication error (HTTP 400 or 401 with `invalid_api_key`) means the key is wrong or revoked.

## Landing sounds on frames

Most sound files start with a short lead-in, so the hit is not at 0:00. Measure where it is, then start the clip at the cue frame minus `round(hit_seconds × fps)`:

```bash
ffmpeg -i click.mp3 -af silencedetect=n=-40dB:d=0.01 -f null - 2>&1 | grep -m1 silence_end
```

`npx hyperframes audio <file> --json` also reports onsets and hits. Keep it at the default local quality: `--quality best` uploads the audio to HeyGen and can bill the account.

Give each sound its own track, so that voice, music, and each effect can move on their own. Keep the music under the voice, and master the final mix at about -16 LUFS ([REFERENCE.md](REFERENCE.md#deliver)).
