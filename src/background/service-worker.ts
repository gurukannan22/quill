import { Message } from '../shared/messages';

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  // If the popup sends a message meant for the content script, we route it.
  if (message.type === 'DETECT_FIELDS' || message.type === 'FILL_FORM' || message.type === 'UNDO_FILL') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, message)
          .then(response => {
            sendResponse(response);
          })
          .catch(error => {
            console.error('Failed to send message to active tab:', error);
            // Graceful fallback for popup
            if (message.type === 'DETECT_FIELDS') {
              sendResponse({ type: 'FIELDS_DETECTED', payload: [] });
            } else if (message.type === 'FILL_FORM') {
              sendResponse({ type: 'FILL_RESULT', payload: { filled: 0, skipped: 0 } });
            } else {
              sendResponse({ type: 'UNDO_DONE' });
            }
          });
      } else {
        if (message.type === 'DETECT_FIELDS') {
          sendResponse({ type: 'FIELDS_DETECTED', payload: [] });
        } else if (message.type === 'FILL_FORM') {
          sendResponse({ type: 'FILL_RESULT', payload: { filled: 0, skipped: 0 } });
        } else {
          sendResponse({ type: 'UNDO_DONE' });
        }
      }
    });
    return true; // Keep channel open for async response
  }
});
