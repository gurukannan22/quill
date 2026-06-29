import React, { useState } from 'react';
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

  const addToast = (
    title: string,
    message?: string,
    type: ToastMessage['type'] = 'info',
    onUndo?: () => void
  ) => {
    const id = nanoid();
    setToasts(prev => [...prev, { id, title, message, type, onUndo }]);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleFillSuccess = (filled: number, skipped: number) => {
    if (filled > 0) {
      const handleUndo = async () => {
        try {
          await chrome.runtime.sendMessage({ type: 'UNDO_FILL' });
          addToast('Fill undone', undefined, 'info');
        } catch {}
      };
      const secondary = skipped > 0 ? `${skipped} field${skipped > 1 ? 's' : ''} skipped (no matching data)` : undefined;
      addToast(`Filled ${filled} ${filled === 1 ? 'field' : 'fields'}`, secondary, 'success', handleUndo);
    } else {
      addToast('No fields filled', 'No matching form found on this page.', 'info');
    }
  };

  return (
    <div className="relative bg-quill-dark-900" style={{ width: 320, minHeight: 200, maxHeight: 600 }}>
      {/* Toast stack */}
      <div className="absolute top-2 left-2 right-2 z-50 flex flex-col gap-1.5 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>

      {/* Views */}
      <div style={{ height: 580 }} className="overflow-hidden">
        {view === 'list' && (
          <ProfileList
            onCreateClick={() => { setEditProfileId(undefined); setView('editor'); }}
            onEditClick={(id) => { setEditProfileId(id); setView('editor'); }}
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
