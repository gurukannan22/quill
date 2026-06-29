import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Upload, AlertTriangle } from 'lucide-react';
import { StorageSchema } from '../../storage/types';
import { getData, updateSettings, exportJSON, importJSON, deleteProfile, getProfiles } from '../../storage/profiles';

interface Props {
  onBack: () => void;
  onToast: (title: string, message?: string, type?: 'success' | 'error') => void;
}

export function Settings({ onBack, onToast }: Props) {
  const [settings, setSettings] = useState<StorageSchema['settings'] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getData().then(data => setSettings(data.settings));
  }, []);

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
      onToast('Profiles exported successfully');
    } catch (e) {
      onToast('Export failed', 'Could not export profiles', 'error');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importJSON(text);
      onToast('Profiles imported successfully');
    } catch (error) {
      onToast('Import failed', 'That file doesn\'t look right. Export a backup from another Quill install and try again.', 'error');
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete ALL profiles? This cannot be undone.')) {
      const profiles = await getProfiles();
      for (const p of profiles) {
        await deleteProfile(p.id);
      }
      onToast('All profiles deleted');
    }
  };

  if (!settings) return null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="flex items-center gap-2 px-2 py-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-slate-900">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-8">
        
        <section>
          <h2 className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3 px-1">
            Preferences
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer px-1">
              <span className="text-sm font-medium text-slate-700">Highlight filled fields</span>
              <input 
                type="checkbox" 
                checked={settings.highlightFilled} 
                onChange={() => handleToggle('highlightFilled')}
                className="w-4 h-4 rounded text-quill-purple-600 focus:ring-quill-purple-500 cursor-pointer" 
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer px-1">
              <span className="text-sm font-medium text-slate-700">Show field count</span>
              <input 
                type="checkbox" 
                checked={settings.showFieldCount} 
                onChange={() => handleToggle('showFieldCount')}
                className="w-4 h-4 rounded text-quill-purple-600 focus:ring-quill-purple-500 cursor-pointer" 
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer px-1">
              <span className="text-sm font-medium text-slate-700">Auto-detect forms</span>
              <input 
                type="checkbox" 
                checked={settings.autoDetectForms} 
                onChange={() => handleToggle('autoDetectForms')}
                className="w-4 h-4 rounded text-quill-purple-600 focus:ring-quill-purple-500 cursor-pointer" 
              />
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3 px-1">
            Data
          </h2>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <Download size={16} className="text-slate-500" />
              Export profiles as JSON
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <Upload size={16} className="text-slate-500" />
              Import from JSON
            </button>
            <input 
              type="file" 
              accept=".json,application/json" 
              ref={fileInputRef} 
              onChange={handleImport} 
              className="hidden" 
            />
          </div>
        </section>

        <section>
          <h2 className="text-[10px] uppercase tracking-wider text-red-400 font-semibold mb-3 px-1">
            Danger zone
          </h2>
          <button
            onClick={handleDeleteAll}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <AlertTriangle size={16} />
            Delete all profiles
          </button>
        </section>

      </main>
    </div>
  );
}
