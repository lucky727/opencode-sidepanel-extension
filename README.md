# OpenCode Sidepanel Extension

Manifest V3 extension that opens OpenCode in the browser Side Panel (Brave/Chrome).

## Setup
1. Load unpacked at `brave://extensions` (Developer mode) → select this folder. Copy the Extension ID.
2. Run `setup.bat` (Windows) or `bash setup.sh` (macOS/Linux) and paste the ID.
3. Start OpenCode: `opencode serve --port 4096 --hostname 127.0.0.1`.

## Usage
Toolbar icon opens the panel; auto-connects to the local OpenCode server. Light/dark toggle via ◐.

## Uninstall
Run `uninstall.bat`, then remove the extension from `brave://extensions`.

## Requirements
Brave/Chrome, Node.js 18+, OpenCode CLI. Native host needs Node on PATH.

License: MIT