# Footage

Code draws UI, type, data, and diagrams best. For photoreal scenes, people, organic motion, textures, or b-roll, generate a clip (Higgsfield, below) or use stock footage whose licence allows this use. Never generate product UI, logos, metrics, or anything that BRIEF.md FACTS says must come from the real product. Ask for clips without text: draw text in code, so that it stays editable.

## Higgsfield access

Higgsfield has no API key. The user signs in to their Higgsfield account with OAuth, and generations use that account's credits. Each client keeps its own sign-in, so signing in through one client does not sign in another. Read the real tool and model names from the server; never guess them.

**Claude Code.** If the session has Higgsfield generation tools, use them. If it has only `mcp__higgsfield__authenticate`, call it and give the user the URL. If their browser then lands on a `localhost/callback` page that fails to load, pass that full URL to `mcp__higgsfield__complete_authentication`.

**OpenClaw.** OpenClaw has its own MCP client, and saved servers reach every runtime, `claude-cli` included:

```bash
openclaw mcp set higgsfield '{"url":"https://mcp.higgsfield.ai/mcp","transport":"streamable-http","auth":"oauth"}'
openclaw mcp login higgsfield              # prints the sign-in URL, then waits for the callback
openclaw mcp login higgsfield --code <code>   # when the user's browser cannot reach this host's callback
openclaw mcp status --verbose
```

`login` waits for the browser, so run it in the background and send the user the URL. The browser cannot reach a container's or a pod's loopback callback. So the user copies the `code` value from the address bar of the page that failed to load. That code is single-use and bound to this login, so it is safe to receive in chat. The tools appear on the next turn. If `openclaw.json` is managed from a repo or a deploy pipeline, a local `mcp set` can be reverted. If the server disappears, ask the operator to add it to that config.

**mcporter** (any host with Node; `npx mcporter` when it is not installed):

```bash
npx mcporter config add higgsfield https://mcp.higgsfield.ai/mcp   # if `list` does not know it
npx mcporter list higgsfield --status        # never starts a sign-in
npx mcporter auth higgsfield --no-browser    # prints the URL, then waits for the callback
npx mcporter list higgsfield --schema
npx mcporter call higgsfield.<tool> key=value --no-oauth --output json
```

On a headless host, the user's browser cannot reach mcporter's loopback callback. Ask the user for the full URL from the address bar of the page that failed to load. Then `curl` that URL from this host while `auth` is still waiting. Use `--no-oauth` on calls, so that an expired sign-in fails fast instead of starting a browser flow.

## Generating

Write each prompt from BRIEF.md LOOK: subject, camera move, lens, light, palette hex values, duration, and an aspect ratio that matches the composition. Generation is asynchronous: poll the job until it finishes, then download the clip into `public/gen/`. Make one test clip and show it before you make the rest. Record the model, the prompt, and the job id in BRIEF.md.

## Placing

A clip is an asset like any other. Put it on its frames, and fix its timing by trimming rather than by generating it again:

```html
<!-- HyperFrames: frames 120-209 at 30 fps, skipping the first 0.5 s of the clip -->
<video class="clip" src="public/gen/shot3.mp4" data-start="4" data-duration="3" data-media-start="0.5" muted></video>
```

```tsx
// Remotion
<Sequence from={120} durationInFrames={90}>
  <OffthreadVideo src={staticFile("gen/shot3.mp4")} trimBefore={15} muted />
</Sequence>
```
