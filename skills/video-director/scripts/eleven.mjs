// ElevenLabs helper for the video-director skill.
// Usage: node eleven.mjs <command> [args] [--force] [--fps=30]
// Key: ELEVENLABS_API_KEY from the environment, else the first .env that has it (see findKey).
//   check                                    is the key set and valid; credits left (never prints the key)
//   voices <search words...>                 list up to 10 voices, save previews to out/voices/
//   design "<voice description>"             3 designed previews to out/voices/design-N.mp3
//   keep <generated_voice_id> <name> <desc>  save a designed voice, print its voice_id
//   tts <voice_id> <text-file> <out.mp3>     narration + <out>.words.json (seconds + clip frames)
//   sfx "<prompt>" <seconds> <out.mp3>       sound effect (0.5-30 s)
//   music "<prompt>" <seconds> <out.mp3>     instrumental music
//   selftest                                 check the word-timing parser offline
// Existing outputs are skipped, so a rerun spends no credits; --force regenerates.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { homedir } from "node:os";
import assert from "node:assert/strict";

const keyIn = (text) => text.match(/^\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=\s*['"]?([^'"\s#]+)/m)?.[1];

// Only this one key is read from the files, so names a host scrubs from the shell stay scrubbed.
// Order: .env files from the working directory upward (a project or workspace .env), this skill's own file,
// then OpenClaw's ~/.openclaw/.env, which the gateway itself reads only at startup.
function findKey() {
  const files = [];
  for (let d = process.cwd(); ; d = dirname(d)) {
    files.push(`${d}/.env`);
    if (d === dirname(d)) break;
  }
  files.push(`${homedir()}/.config/video-director/.env`, `${homedir()}/.openclaw/.env`);
  for (const f of files) {
    try {
      const key = keyIn(readFileSync(f, "utf8"));
      if (key) return key;
    } catch {}
  }
}
process.env.ELEVENLABS_API_KEY ||= findKey() ?? "";
const SETUP = `ELEVENLABS_API_KEY is not set: not in the environment, a .env from here upward,
~/.config/video-director/.env, or ~/.openclaw/.env.
The user creates a key at https://elevenlabs.io/app/settings/api-keys. How it reaches this process
depends on the platform (AUDIO.md, "The key"). Never ask for the key in the chat.`;
const API = "https://api.elevenlabs.io";
const FMT = "output_format=mp3_44100_128"; // 192 kbps is refused on lower tiers
const flags = process.argv.slice(2).filter((a) => a.startsWith("--"));
const [cmd, ...args] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const force = flags.includes("--force");
const fps = Number(flags.find((f) => f.startsWith("--fps="))?.slice(6) ?? 30);

async function api(path, body) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error(SETUP);
  const res = await fetch(API + path, {
    method: body ? "POST" : "GET",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path.split("?")[0]}: HTTP ${res.status} ${await res.text()}`);
  return res.headers.get("content-type")?.includes("json") ? res.json() : Buffer.from(await res.arrayBuffer());
}

function save(file, data) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  console.log(`wrote ${file}`);
}

function fresh(file) {
  if (force || !existsSync(file)) return true;
  console.log(`${file} exists, skipped (--force to regenerate)`);
  return false;
}

// Character alignment -> words with start/end seconds and the clip-relative start frame.
function toWords(al, fps) {
  const words = [];
  let cur = null;
  al.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) return void (cur && words.push(cur), (cur = null));
    const s = al.character_start_times_seconds[i];
    if (!cur) cur = { w: "", s, e: s, f: Math.round(s * fps) };
    cur.w += ch;
    cur.e = al.character_end_times_seconds[i];
  });
  if (cur) words.push(cur);
  return words;
}

// Every search word must start some word of the voice's name, description or labels ("male" ≠ "female").
function matches(v, search) {
  const tokens = [v.name, v.description, ...Object.values(v.labels ?? {})].join(" ").toLowerCase().split(/[^a-z0-9]+/);
  return search.every((w) => tokens.some((t) => t.startsWith(w.toLowerCase())));
}

const commands = {
  async check() {
    if (!process.env.ELEVENLABS_API_KEY) return console.log(SETUP), process.exit(2);
    await api("/v2/voices?page_size=1"); // throws with the HTTP status on a bad key
    const s = await api("/v1/user/subscription").catch(() => null); // a restricted key may not read usage
    console.log(s ? `key ok: ${s.tier}, ${s.character_limit - s.character_count} of ${s.character_limit} credits left` : "key ok");
  },
  async voices(...search) {
    // The API's search matches one phrase, so filter word by word here.
    const { voices } = await api("/v2/voices?page_size=100");
    const hits = voices.filter((v) => matches(v, search)).slice(0, 10);
    if (!hits.length) console.log("no match; try fewer words or `design`");
    for (const v of hits) {
      console.log(`${v.voice_id}  ${v.name}  [${Object.values(v.labels ?? {}).join(", ")}]  ${v.description ?? ""}`);
      const file = `out/voices/${v.voice_id}.mp3`;
      if (v.preview_url && fresh(file)) save(file, Buffer.from(await (await fetch(v.preview_url)).arrayBuffer()));
    }
  },
  async design(description) {
    const { previews } = await api(`/v1/text-to-voice/design?${FMT}`, {
      voice_description: description,
      model_id: "eleven_ttv_v3",
      auto_generate_text: true,
    });
    previews.forEach((p, i) => {
      save(`out/voices/design-${i + 1}.mp3`, Buffer.from(p.audio_base_64, "base64"));
      console.log(`  design-${i + 1}: generated_voice_id ${p.generated_voice_id}`);
    });
  },
  async keep(generatedId, name, description) {
    const { voice_id } = await api("/v1/text-to-voice", {
      voice_name: name,
      voice_description: description,
      generated_voice_id: generatedId,
    });
    console.log(`voice_id ${voice_id}`);
  },
  async tts(voiceId, textFile, out) {
    if (!fresh(out)) return;
    const body = await api(`/v1/text-to-speech/${voiceId}/with-timestamps?${FMT}`, {
      text: readFileSync(textFile, "utf8").trim(),
      model_id: "eleven_v4",
      seed: 7,
    });
    save(out, Buffer.from(body.audio_base64, "base64"));
    if (!body.alignment) return console.log("no alignment returned; place cues from the waveform");
    save(out.replace(/\.mp3$/, ".words.json"), JSON.stringify({ fps, words: toWords(body.alignment, fps) }, null, 1));
  },
  async sfx(prompt, seconds, out) {
    if (!fresh(out)) return;
    save(out, await api(`/v1/sound-generation?${FMT}`, {
      text: prompt,
      duration_seconds: Number(seconds),
      model_id: "eleven_text_to_sound_v3",
    }));
  },
  async music(prompt, seconds, out) {
    if (!fresh(out)) return;
    save(out, await api(`/v1/music?${FMT}`, {
      prompt,
      music_length_ms: Math.round(Number(seconds) * 1000),
      model_id: "music_v2_5",
      force_instrumental: true,
    }));
  },
  selftest() {
    const al = {
      characters: [..."Hi  yo"],
      character_start_times_seconds: [0, 0.1, 0.2, 0.3, 0.5, 0.6],
      character_end_times_seconds: [0.1, 0.2, 0.3, 0.5, 0.6, 0.7],
    };
    assert.deepEqual(toWords(al, 30), [
      { w: "Hi", s: 0, e: 0.2, f: 0 },
      { w: "yo", s: 0.5, e: 0.7, f: 15 },
    ]);
    const alice = { name: "Alice", description: "Clear educator", labels: { accent: "british", gender: "female" } };
    assert.equal(matches(alice, ["british", "male"]), false);
    assert.equal(matches(alice, ["brit", "female"]), true);
    assert.equal(keyIn("A=1\nexport ELEVENLABS_API_KEY='sk_abc'\n"), "sk_abc");
    assert.equal(keyIn("ELEVENLABS_API_KEY=sk_x # note"), "sk_x");
    assert.equal(keyIn("OTHER_ELEVENLABS_API_KEY=sk_no"), undefined);
    console.log("selftest ok");
  },
};

if (!commands[cmd]) {
  console.error(readFileSync(new URL(import.meta.url), "utf8").split("\nimport")[0]);
  process.exit(1);
}
await commands[cmd](...args);
