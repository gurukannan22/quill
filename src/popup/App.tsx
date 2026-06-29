import React, { useState, useEffect } from 'react';
import { ProfileList } from './views/ProfileList';
import { ProfileEditor } from './views/ProfileEditor';
import { Settings } from './views/Settings';
import { Toast, ToastMessage } from './components/Toast';
import { nanoid } from 'nanoid';

type ViewState = 'list' | 'editor' | 'settings';

export default function App() {
  const [view, setView] = useState<ViewState>('list');
  const [editProfileId, setEditProfileId] = useState<string | undefined>();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info', onUndo?: () => void) => {
    const id = nanoid();
    setToasts(prev => [...prev, { id, title, message, type, onUndo }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleFillSuccess = (filled: number, skipped: number) => {
    if (filled > 0) {
      const msg = skipped > 0 ? `Filled ${filled} of ${filled + skipped} fields` : '';
      
      const handleUndo = async () => {
        try {
          await chrome.runtime.sendMessage({ type: 'UNDO_FILL' });
          addToast('Form fill undone', undefined, 'info');
        } catch (e) {
          console.error(e);
        }
      };

      addToast(`Filled ${filled} ${filled === 1 ? 'field' : 'fields'}`, msg, 'success', handleUndo);
    } else {
      addToast('No fields filled', 'Form not found on this page or no matching fields.', 'info');
    }
  };

  return (
    <div className="h-screen flex flex-col relative bg-slate-50">
      <div className="absolute top-2 left-2 right-2 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'list' && (
          <ProfileList
            onCreateClick={() => {
              setEditProfileId(undefined);
              setView('editor');
            }}
            onEditClick={(id) => {
              setEditProfileId(id);
              setView('editor');
            }}
            onSettingsClick={() => setView('settings')}
            onFillSuccess={handleFillSuccess}
            onUndoAvailable={() => {}}
          />
        )}

        {view === 'editor' && (
          <ProfileEditor
            profileId={editProfileId}
            onBack={() => setView('list')}
            onSave={() => setView('list')}
          />
        )}

        {view === 'settings' && (
          <Settings
            onBack={() => setView('list')}
            onToast={addToast}
          />
        )}
      </div>
    </div>
  );
}
