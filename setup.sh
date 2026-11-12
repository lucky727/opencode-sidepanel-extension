#!/usr/bin/env bash
set -e
echo "=== OpenCode Side Panel - Auto Setup ==="

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js not found. Install from https://nodejs.org"; exit 1
fi
echo "Node.js: $(node --version)"

if ! command -v opencode >/dev/null 2>&1; then
  echo "[WARN] opencode not found on PATH. Install OpenCode first."
else
  echo "OpenCode: $(opencode --version)"
fi

read -rp "Enter the Extension ID from brave://extensions: " EXTID
if [ -z "$EXTID" ]; then echo "Extension ID required."; exit 1; fi

DIR="$(cd "$(dirname "$0")" && pwd)"
MANIFEST="$DIR/com.opencode.sidepanel.json"
HOST="$DIR/host.js"

node -e "
const fs=require('fs');
const id=process.argv[1];
const host=process.argv[2];
const manifest=process.argv[3];
const obj={name:'com.opencode.sidepanel',description:'OpenCode Side Panel native messaging host',path:host,type:'stdio',allowed_origins:['chrome-extension://'+id+'/']};
fs.writeFileSync(manifest,JSON.stringify(obj,null,2));
" "$EXTID" "$HOST" "$MANIFEST"

HOSTS_DIR="$HOME/.config/BraveSoftware/Brave-Browser/NativeMessagingHosts"
mkdir -p "$HOSTS_DIR"
cp "$MANIFEST" "$HOSTS_DIR/com.opencode.sidepanel.json"
echo "[OK] Native messaging host registered for Brave."
echo "Open brave://extensions and click the OpenCode toolbar icon."