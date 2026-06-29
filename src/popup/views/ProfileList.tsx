import React, { useEffect, useState } from 'react';
import { Profile, StorageSchema } from '../../storage/types';
import { setActiveProfileId, getData } from '../../storage/profiles';
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
  const [filling, setFilling] = useState(false);
  const [detectedFields, setDetectedFields] = useState<DetectedField[]>([]);
  const [showCount, setShowCount] = useState(true);

  useEffect(() => {
    getData().then((data: StorageSchema) => {
      setProfiles(data.profiles);
      setActiveId(data.activeProfileId);
      setShowCount(data.settings.showFieldCount);
      setLoading(false);
    });

    chrome.runtime.sendMessage({ type: 'DETECT_FIELDS' })
      .then(response => {
        if (response?.type === 'FIELDS_DETECTED') {
          setDetectedFields(response.payload || []);
        }
      })
      .catch(() => setDetectedFields([]));
  }, []);

  const handleSelect = async (id: string) => {
    setActiveId(id);
    await setActiveProfileId(id);
  };

  const handleFill = async () => {
    if (!activeId || filling) return;
    setFilling(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'FILL_FORM',
        payload: { profileId: activeId }
      });
      if (response?.type === 'FILL_RESULT') {
        const { filled, skipped } = response.payload;
        onFillSuccess(filled, skipped);
        if (filled > 0) onUndoAvailable();
      }
    } catch (e) {
      onFillSuccess(0, 0);
    } finally {
      setFilling(false);
    }
  };

  const activeProfile = profiles.find(p => p.id === activeId);
  const fieldCount = detectedFields.length;

  /* ──────── Loading skeleton ──────── */
  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        {[1, 2].map(i => (
          <div key={i} className="h-[60px] bg-quill-dark-700 rounded-[20px] overflow-hidden relative">
            <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-quill-dark-900">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          {/* Logo */}
          <img src="/icons/icon-48.png" className="w-8 h-8 rounded-[14px] shadow-lg shadow-quill-purple-900/50" alt="Quill Logo" />
          <span className="font-bold text-slate-100 tracking-tight">Quill</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onSettingsClick}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-white/6 rounded-[12px] transition-all duration-150"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-quill-purple-600/20 hover:bg-quill-purple-600/30 text-quill-purple-400 hover:text-quill-purple-300 rounded-[12px] text-xs font-semibold transition-all duration-150"
          >
            <Plus size={14} strokeWidth={2.5} />
            New
          </button>
        </div>
      </header>

      {/* ── Profile count badge ── */}
      {profiles.length > 0 && (
        <div className="px-4 mb-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
            {profiles.length} {profiles.length === 1 ? 'Profile' : 'Profiles'}
          </p>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-28">
        {profiles.length === 0 ? (
          <EmptyState onCreateClick={onCreateClick} />
        ) : (
          <div className="space-y-1 py-1">
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

      {/* ── Fill CTA footer ── */}
      {profiles.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-3 pb-3 pt-2 bg-gradient-to-t from-quill-dark-900 via-quill-dark-900/95 to-transparent">
          <button
            onClick={handleFill}
            disabled={!activeId || filling}
            className="w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-[20px] font-semibold text-sm transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #534AB7 0%, #7F77DD 50%, #9B8EE8 100%)',
              boxShadow: '0 4px 24px rgba(127, 119, 221, 0.35)',
            }}
          >
            {/* Shimmer overlay on hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/8 transition-all duration-200" />
            <Zap
              size={16}
              className={`text-amber-300 fill-amber-300 relative z-10 ${filling ? 'animate-pulse' : ''}`}
            />
            <span className="relative z-10 text-white">
              {filling ? 'Filling…' : `Fill with ${activeProfile?.name || '…'}`}
            </span>
          </button>

          {showCount && (
            <p className="text-center text-[11px] mt-2 font-medium">
              {fieldCount > 0 ? (
                <span className="text-quill-purple-400">
                  ✦ {fieldCount} {fieldCount === 1 ? 'field' : 'fields'} detected
                </span>
              ) : (
                <span className="text-slate-600">No form detected on this page</span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
