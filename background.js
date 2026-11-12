chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.action.onClicked.addListener(async () => {
  try {
    chrome.runtime.sendNativeMessage('com.opencode.sidepanel', { action: 'start' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Native messaging error:', chrome.runtime.lastError.message);
      }
    });
  } catch (e) {
    console.log('Error starting OpenCode:', e);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getActiveTab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (tab) sendResponse({ url: tab.url, title: tab.title, id: tab.id });
      else sendResponse({ url: null });
    });
    return true;
  }

  if (msg.action === 'getPageContent') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (!tab || !tab.id) { sendResponse({ ok: false }); return; }
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const sel = window.getSelection ? String(window.getSelection()) : '';
          const text = (document.body && document.body.innerText) || '';
          return { url: location.href, title: document.title, selection: sel.slice(0, 2000), text: text.slice(0, 12000) };
        }
      }, (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          sendResponse({ ok: false, error: chrome.runtime.lastError && chrome.runtime.lastError.message });
          return;
        }
        sendResponse({ ok: true, data: results[0].result, tabId: tab.id });
      });
    });
    return true;
  }

  if (msg.action === 'fillInput') {
    chrome.tabs.query({}, (tabs) => {
      const ocTabs = tabs.filter(t => t.url && (t.url.includes('127.0.0.1:4096') || t.url.includes('localhost:4096')));
      if (ocTabs.length === 0) { sendResponse({ ok: false, error: 'no opencode tab' }); return; }
      let done = false;
      ocTabs.forEach((t) => {
        chrome.tabs.sendMessage(t.id, { action: 'fillInput', text: msg.text }, (resp) => {
          if (!done && !chrome.runtime.lastError) {
            done = true;
            sendResponse(resp || { ok: true });
          }
        });
      });
      setTimeout(() => { if (!done) sendResponse({ ok: false, error: 'timeout' }); }, 1500);
    });
    return true;
  }

  return false;
});