import React, { useEffect, useState } from 'react';
import { Profile, StorageSchema } from '../../storage/types';
import { getProfiles, setActiveProfileId, getData } from '../../storage/profiles';
import { ProfileCard } from '../components/ProfileCard';
import { EmptyState } from '../components/EmptyState';
import { Settings, Plus, Zap } from 'lucide-react';
import { DetectedField } from '../../shared/messages';

interface Props {
  onCreateClick: () => void;
  onEditClick: (profileId: string) => void;
  onSettingsClick: () => void;
  onFillSuccess: (filled: number, skipped: number) => void;
  onUndoAvailable: () => void;
}

export function ProfileList({ onCreateClick, onEditClick, onSettingsClick, onFillSuccess, onUndoAvailable }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [showCount, setShowCount] = useState(true);

  useEffect(() => {
    getData().then((data: StorageSchema) => {
      setProfiles(data.profiles);
      setActiveId(data.activeProfileId);
      setShowCount(data.settings.showFieldCount);
      setLoading(false);
    });

    // Ask content script how many fields are detected
    chrome.runtime.sendMessage({ type: 'DETECT_FIELDS' })
      .then(response => {
        if (response?.type === 'FIELDS_DETECTED') {
          setDetectedFields(response.payload || []);
        }
      })
      .catch(() => {
        // Content script might not be injected (e.g. extension just installed, page not refreshed)
        setDetectedFields([]);
      });
  }, []);

  const handleSelect = async (id: string) => {
    setActiveId(id);
    await setActiveProfileId(id);
  };

  const handleFill = async () => {
    if (!activeId) return;
    
    try {
      const response = await chrome.runtime.sendMessage({ 
        type: 'FILL_FORM', 
        payload: { profileId: activeId } 
      });
      
      if (response?.type === 'FILL_RESULT') {
        const { filled, skipped } = response.payload;
        onFillSuccess(filled, skipped);
        if (filled > 0) {
          onUndoAvailable();
        }
      }
    } catch (e) {
      console.error(e);
      // Fail gracefully
      onFillSuccess(0, 0);
    }
  };

  const activeProfile = profiles.find(p => p.id === activeId);

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-16 bg-slate-100 rounded-xl w-full"></div>
        <div className="h-16 bg-slate-100 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-quill-purple-600 rounded-md flex items-center justify-center">
             {/* Simple feather representation */}
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
              <line x1="16" y1="8" x2="2" y2="22"></line>
              <line x1="17.5" y1="15" x2="9" y2="6.5"></line>
            </svg>
          </div>
          <h1 className="font-semibold text-slate-900">Quill</h1>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onSettingsClick} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings size={18} />
          </button>
          <button onClick={onCreateClick} className="p-1.5 text-slate-400 hover:text-quill-purple-600 hover:bg-quill-purple-50 rounded-lg transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {profiles.length === 0 ? (
          <EmptyState onCreateClick={onCreateClick} />
        ) : (
          <div className="space-y-2">
            <h2 className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3 px-1">
              Your profiles
            </h2>
            {profiles.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                isSelected={profile.id === activeId}
                onClick={() => handleSelect(profile.id)}
                onEdit={() => onEditClick(profile.id)}
              />
            ))}
          </div>
        )}
      </main>

      {profiles.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
          <button
            onClick={handleFill}
            disabled={!activeId}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-slate-800 transition-colors active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Zap size={16} className="text-amber-400 fill-amber-400" />
            Fill form with {activeProfile?.name || '...'}
          </button>
          
          {showCount && (
            <p className="text-center text-[11px] text-slate-400 mt-2">
              {detectedFields.length > 0 
                ? `📋 ${detectedFields.length} fields detected` 
                : 'No form detected on this page'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
