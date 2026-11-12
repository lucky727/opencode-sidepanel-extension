const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read message from stdin (native messaging protocol)
function readMessage() {
  return new Promise((resolve) => {
    let sizeBuffer = Buffer.alloc(4);
    let bytesRead = 0;
    process.stdin.on('readable', function handler() {
      while (true) {
        const chunk = process.stdin.read(4 - bytesRead);
        if (!chunk) return;
        chunk.copy(sizeBuffer, bytesRead);
        bytesRead += chunk.length;
        if (bytesRead === 4) {
          const size = sizeBuffer.readUInt32LE(0);
          let msgBuf = Buffer.alloc(0);
          let msgRead = 0;
          const readMsg = () => {
            const c = process.stdin.read(size - msgRead);
            if (!c) { process.stdin.once('readable', readMsg); return; }
            msgBuf = Buffer.concat([msgBuf, c]);
            msgRead += c.length;
            if (msgRead === size) {
              process.stdin.removeListener('readable', handler);
              try { resolve(JSON.parse(msgBuf.toString('utf8'))); } catch (e) { resolve({}); }
            } else {
              readMsg();
            }
          };
          readMsg();
          return;
        }
      }
    });
  });
}

function sendMessage(msg) {
  const json = JSON.stringify(msg);
  const buf = Buffer.from(json, 'utf8');
  const size = Buffer.alloc(4);
  size.writeUInt32LE(buf.length, 0);
  process.stdout.write(size);
  process.stdout.write(buf);
}

function findOpencode() {
  const candidates = ['opencode', 'opencode.exe'];
  // Try PATH
  for (const c of candidates) {
    try {
      const { execSync } = require('child_process');
      execSync(`where ${c}`, { stdio: 'ignore' });
      return c;
    } catch (e) {}
  }
  // Common install locations
  const home = process.env.USERPROFILE || process.env.HOME;
  const paths = [
    path.join(home, '.opencode', 'bin', 'opencode.exe'),
    path.join(home, 'AppData', 'Roaming', 'npm', 'node_modules', '@opencode', 'cli', 'bin', 'opencode.exe'),
    path.join(home, 'AppData', 'Roaming', 'npm', 'opencode.cmd'),
    'C:\\Program Files\\opencode\\opencode.exe'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

(async () => {
  const msg = await readMessage();
  if (msg && msg.action === 'start') {
    const bin = findOpencode();
    if (!bin) {
      sendMessage({ ok: false, error: 'opencode binary not found' });
      process.exit(0);
      return;
    }
    // Start opencode web server silently
    try {
      const child = spawn(bin, ['serve', '--port', '4096', '--hostname', '127.0.0.1'], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      });
      child.unref();
      sendMessage({ ok: true, pid: child.pid });
    } catch (e) {
      sendMessage({ ok: false, error: String(e) });
    }
  } else {
    sendMessage({ ok: false, error: 'unknown action' });
  }
  process.exit(0);
})();
