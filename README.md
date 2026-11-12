# OpenCode Sidepanel Extension

A Manifest V3 browser extension that opens the OpenCode web interface in Brave/Chrome's native Side Panel, with active-tab context sharing, page reading, screenshots, an "AI browsing" glow, and browser control helpers.

## Features

- Side Panel chat powered by your local OpenCode server (`http://127.0.0.1:4096`).
- Auto-start / auto-connect to the OpenCode server when invoked.
- Active tab context: Send, Read page, Include tab, Screenshot.
- Browser control buttons: Back, Forward, Reload.
- Glow indicator on tabs OpenCode is controlling.
- Session history dropdown (recent sessions).

## Requirements

- Brave or any Chromium-based browser (Chrome, Edge, …).
- Node.js 18+.
- OpenCode CLI installed and on PATH:
  - `opencode serve --port 4096 --hostname 127.0.0.1` must work.
  - Verify with: `opencode --version`.
- (Optional, for auto-start) permission to register a native messaging host.

## Install the extension (unpacked)

1. Clone or download this repository.
2. Open Brave and go to `brave://extensions/` (Chrome: `chrome://extensions/`).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this repository folder (the one containing `manifest.json`).
5. Copy the generated **Extension ID**.

## Register the native messaging host (auto-start OpenCode)

This lets the extension start `opencode serve` automatically. Use the auto-setup script for the easiest path:

### Auto setup (recommended)
- Windows: run `setup.bat`.
- macOS/Linux: run `bash setup.sh`.
- The script checks Node.js/OpenCode, prompts for the Extension ID, and registers the native host.

### Windows (manual)
1. Run `install.bat`.
2. Paste the Extension ID when prompted.
3. The script registers `com.opencode.sidepanel` for Brave (and Chrome fallback) and points it at `host.bat`.

### Manual (any OS)
1. Edit `com.opencode.sidepanel.json`:
   - Set `path` to the absolute path of `host.js` runner (or `host.bat` on Windows).
   - Set `allowed_origins` to `["chrome-extension://<YOUR_EXTENSION_ID>/"]`.
2. Copy the JSON to the browser's native messaging hosts directory:
   - Brave (Windows): `%LOCALAPPDATA%\BraveSoftware\Brave-Browser\User Data\NativeMessagingHosts\com.opencode.sidepanel.json`
   - Chrome (Windows): `%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts\com.opencode.sidepanel.json`
   - macOS/Linux: `~/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts/` (or Chrome equivalent).
3. Ensure `host.js` is executable and `node` is on PATH.

## Run OpenCode manually (if not using the native host)

```sh
opencode serve --port 4096 --hostname 127.0.0.1
```

Then click the OpenCode toolbar icon to open the Side Panel.

## Usage

- Click the OpenCode icon in the toolbar to open the Side Panel.
- **Back / Forward / Reload**: navigate the active tab.
- **Include (+)**: attach the active tab to OpenCode control (glow indicator).
- **Read (R)**: send the page's title, URL, selection, and text to OpenCode.
- **Snap (S)**: copy a screenshot of the visible tab to the clipboard.
- **Send (→)**: send the active tab's URL/title as context.
- **History (H)**: reopen recently used sessions.

## Uninstall

1. Run `uninstall.bat` (Windows) to remove the native host registry entry.
2. Remove the extension from `brave://extensions/`.

## Troubleshooting

- Side Panel shows "OpenCode not running": start `opencode serve --port 4096 --hostname 127.0.0.1`.
- Native host errors: confirm Node.js is on PATH and the Extension ID in `com.opencode.sidepanel.json` matches the installed extension.
- Auth on the OpenCode API: the web UI works without auth; API calls require `OPENCODE_SERVER_PASSWORD` if set.

## License

MIT
