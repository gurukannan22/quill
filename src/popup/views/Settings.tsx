import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Upload, AlertTriangle, Highlighter, Hash, ScanSearch, ChevronRight } from 'lucide-react';
import type { StorageSchema } from '../../storage/types';
import { getData, updateSettings, exportJSON, importJSON, deleteProfile, getProfiles } from '../../storage/profiles';
import { clsx } from 'clsx';

interface Props {
  onBack: () => void;
  onToast: (title: string, message?: string, type?: 'success' | 'error') => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={clsx(
        'relative w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0',
        checked ? 'bg-quill-purple-600' : 'bg-quill-dark-500'
      )}
    >
      <span className={clsx(
        'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
        checked ? 'translate-x-4' : 'translate-x-0'
      )} />
    </button>
  );
}

export function Settings({ onBack, onToast }: Props) {
  const [settings, setSettings] = useState<StorageSchema['settings'] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getData().then(data => setSettings(data.settings)); }, []);

  const handleToggle = async (key: keyof StorageSchema['settings']) => {
    if (!settings) return;
    const newVal = !settings[key];
    setSettings({ ...settings, [key]: newVal });
    await updateSettings({ [key]: newVal });
  };

  const handleExport = async () => {
    try {
      const json = await exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quill-profiles-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onToast('Profiles exported', 'Saved as JSON file', 'success');
    } catch {
      onToast('Export failed', 'Could not export profiles', 'error');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await importJSON(text);
      onToast('Profiles imported', 'Your profiles have been merged', 'success');
    } catch {
      onToast('Import failed', "That file doesn't look right. Try a backup from another Quill install.", 'error');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteAll = async () => {
    if (confirm('Delete ALL profiles? This cannot be undone.')) {
      const profiles = await getProfiles();
      for (const p of profiles) await deleteProfile(p.id);
      onToast('All profiles deleted');
    }
  };

  if (!settings) return null;

  return (
    <div className="flex flex-col h-full bg-quill-dark-900 animate-fadeIn">

      <header className="flex items-center gap-2 px-3 pt-4 pb-3 sticky top-0 bg-quill-dark-900 z-10">
        <button
          onClick={onBack}
          className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/6 rounded-[12px] transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-bold text-slate-100">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 space-y-6">

        {/* Preferences */}
        <section>
          <SectionLabel>Preferences</SectionLabel>
          <div className="bg-quill-dark-700 rounded-[20px] border border-white/6 overflow-hidden divide-y divide-white/5">
            <SettingRow
              icon={<Highlighter size={15} />}
              label="Highlight filled fields"
              description="Show a blue ring on filled inputs"
              checked={settings.highlightFilled}
              onChange={() => handleToggle('highlightFilled')}
            />
            <SettingRow
              icon={<Hash size={15} />}
              label="Show field count"
              description="Display detected fields in popup"
              checked={settings.showFieldCount}
              onChange={() => handleToggle('showFieldCount')}
            />
            <SettingRow
              icon={<ScanSearch size={15} />}
              label="Auto-detect forms"
              description="Badge icon when a form is found"
              checked={settings.autoDetectForms}
              onChange={() => handleToggle('autoDetectForms')}
            />
          </div>
        </section>

        {/* Data */}
        <section>
          <SectionLabel>Data</SectionLabel>
          <div className="space-y-2">
            <ActionButton icon={<Download size={15} />} onClick={handleExport}>
              Export profiles as JSON
            </ActionButton>
            <ActionButton icon={<Upload size={15} />} onClick={() => fileInputRef.current?.click()}>
              Import from JSON
            </ActionButton>
            <input type="file" accept=".json,application/json" ref={fileInputRef} onChange={handleImport} className="hidden" />
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <SectionLabel className="text-red-500/70">Danger zone</SectionLabel>
          <button
            onClick={handleDeleteAll}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold text-red-400 bg-red-500/8 hover:bg-red-500/15 border border-red-500/15 rounded-[18px] transition-all"
          >
            <AlertTriangle size={15} />
            Delete all profiles
          </button>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs font-medium text-slate-500">
        <p className="mb-1">Quill Extension v0.1.0</p>
        <p>Made with &lt;3 by gurukannan22</p>
      </footer>
      </main>
    </div>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('flex items-center gap-3 mb-2', className)}>
      <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold whitespace-nowrap">{children}</p>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

function SettingRow({
  icon, label, description, checked, onChange,
}: {
  icon: React.ReactNode; label: string; description: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors">
      <span className="text-slate-500">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-[11px] text-slate-600 mt-0.5">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </label>
  );
}

function ActionButton({ icon, children, onClick }: { icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 bg-quill-dark-700 hover:bg-quill-dark-600 border border-white/6 rounded-[18px] transition-all group"
    >
      <span className="text-slate-500 group-hover:text-slate-400 transition-colors">{icon}</span>
      <span className="flex-1 text-left">{children}</span>
      <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
    </button>
  );
}
