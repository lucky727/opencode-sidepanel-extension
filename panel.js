const frame = document.getElementById('frame');
const overlay = document.getElementById('overlay');

const BASE = 'http://127.0.0.1:4096';

// Ask native host to start opencode server (auto-connect)
try { chrome.runtime.sendNativeMessage('com.opencode.sidepanel', { action: 'start' }, () => {}); } catch (e) {}

async function waitForServer(maxAttempts = 40) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const r = await fetch(BASE + '/', { method: 'GET' });
      if (r.ok) return true;
    } catch (e) {}
    await new Promise(res => setTimeout(res, 500));
  }
  return false;
}

async function createNewSession() {
  const ready = await waitForServer();
  if (!ready) {
    document.getElementById('overlayMsg').textContent = 'OpenCode not running. Start "opencode serve --port 4096".';
    return;
  }
  try {
    const res = await fetch(BASE + '/session', { method: 'POST' });
    if (!res.ok) throw new Error('bad status');
    const session = await res.json();
    if (session && session.id) {
      const dir = (session.directory || '').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      frame.src = dir ? `${BASE}/${dir}/session/${session.id}` : `${BASE}/session/${session.id}`;
      return;
    }
    frame.src = BASE + '/';
  } catch (e) {
    frame.src = BASE + '/';
  }
}

createNewSession();

frame.addEventListener('load', () => {
  overlay.classList.add('hidden');
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
});

setTimeout(() => {
  overlay.classList.add('hidden');
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
}, 8000);