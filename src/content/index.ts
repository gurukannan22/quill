import { detectFields } from './detector';
import { fillField } from './filler';
import { highlightField } from './highlighter';
import { Message, DetectedField } from '../shared/messages';
import { Profile } from '../storage/types';

// Track snapshot for undo
const undoSnapshot = new Map<HTMLElement, string>();

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === 'DETECT_FIELDS') {
    const fields = detectFields();
    sendResponse({ type: 'FIELDS_DETECTED', payload: fields });
  } 
  
  else if (message.type === 'FILL_FORM' && 'payload' in message) {
    // The background script has sent us the profile data directly in the message
    // because content script cannot easily access chrome.storage.local if we want to keep it simple,
    // wait, the spec says background sends profile data + field assignments to content script.
    // Let's adjust this to expect profile data directly or we can fetch it from storage.
    // Actually, content script CAN access chrome.storage.local! Let's fetch the profile.
    
    const profileId = message.payload.profileId;
    
    chrome.storage.local.get('quill_data').then(result => {
      const data = result['quill_data'];
      const profile = data?.profiles?.find((p: Profile) => p.id === profileId);
      const settings = data?.settings || { highlightFilled: true };
      
      if (!profile) {
        sendResponse({ type: 'FILL_RESULT', payload: { filled: 0, skipped: 0 } });
        return;
      }

      const fields = detectFields();
      let filled = 0;
      let skipped = 0;
      undoSnapshot.clear();

      for (const field of fields) {
        const value = profile.fields[field.key];
        if (!value) {
          skipped++;
          continue;
        }

        const el = document.querySelector(`[data-quill-id="${field.elementId}"]`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (!el) {
          skipped++;
          continue;
        }

        // Snapshot
        undoSnapshot.set(el, el.value);

        const success = fillField(el, value);
        if (success) {
          filled++;
          if (settings.highlightFilled) {
            highlightField(el);
          }
        } else {
          skipped++;
        }
      }

      sendResponse({ type: 'FILL_RESULT', payload: { filled, skipped } });
    });
    
    return true; // Keep message channel open for async response
  }
  
  else if (message.type === 'UNDO_FILL') {
    for (const [el, originalValue] of undoSnapshot.entries()) {
      fillField(el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, originalValue);
    }
    undoSnapshot.clear();
    sendResponse({ type: 'UNDO_DONE' });
  }
});
