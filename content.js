chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'fillInput') {
    try {
      const selectors = [
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]',
        '[role="textbox"]'
      ];
      let target = null;
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) { target = el; break; }
      }
      if (!target) {
        sendResponse({ ok: false, error: 'no input found' });
        return true;
      }
      if (target.isContentEditable) {
        target.focus();
        target.textContent = msg.text;
        target.dispatchEvent(new InputEvent('input', { bubbles: true }));
      } else {
        target.focus();
        target.value = msg.text;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
      }
      sendResponse({ ok: true });
    } catch (e) {
      sendResponse({ ok: false, error: String(e) });
    }
    return true;
  }
  return false;
});
