import React, { useState, useEffect } from 'react';
import type { Profile, ProfileColor, ProfileIcon, FieldKey } from '../../storage/types';
import { getProfiles, saveProfile, deleteProfile } from '../../storage/profiles';
import { FieldRow } from '../components/FieldRow';
import { ArrowLeft, User, Building, Briefcase, GraduationCap, Heart, Trash2, Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import { clsx } from 'clsx';
import { COLOR_MAP } from '../components/ProfileCard';

interface Props {
  profileId?: string;
  onBack: () => void;
  onSave: () => void;
}

const ICONS: { id: ProfileIcon; icon: any; label: string }[] = [
  { id: 'user',      icon: User,          label: 'Person' },
  { id: 'building',  icon: Building,      label: 'Office' },
  { id: 'briefcase', icon: Briefcase,     label: 'Work' },
  { id: 'school',    icon: GraduationCap, label: 'School' },
  { id: 'heart',     icon: Heart,         label: 'Personal' },
];

const COLORS: ProfileColor[] = ['blue', 'purple', 'amber', 'green', 'pink'];

const COLOR_SOLID: Record<ProfileColor, string> = {
  blue:   'from-blue-500 to-cyan-500',
  purple: 'from-violet-500 to-purple-500',
  amber:  'from-amber-500 to-orange-500',
  green:  'from-emerald-500 to-teal-500',
  pink:   'from-pink-500 to-rose-500',
};

const COLOR_RING: Record<ProfileColor, string> = {
  blue:   'ring-blue-500/60',
  purple: 'ring-violet-500/60',
  amber:  'ring-amber-500/60',
  green:  'ring-emerald-500/60',
  pink:   'ring-pink-500/60',
};

export function ProfileEditor({ profileId, onBack, onSave }: Props) {
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: '', icon: 'user', color: 'blue', fields: {},
  });
  const [loading, setLoading] = useState(!!profileId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profileId) {
      getProfiles().then(profiles => {
        const p = profiles.find(p => p.id === profileId);
        if (p) setProfile(p);
        setLoading(false);
      });
    }
  }, [profileId]);

  const updateField = (key: FieldKey, value: string) => {
    setProfile(prev => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
  };

  const handleSave = async () => {
    if (!profile.name?.trim()) { setError('Profile name is required'); return; }
    if (profile.fields?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.fields.email)) {
      setError('Invalid email address'); return;
    }
    const hasData = Object.values(profile.fields || {}).some(v => v?.trim());
    if (!hasData) { setError('Fill in at least one field to save'); return; }

    setError(null);
    setSaving(true);
    const fullProfile: Profile = {
      id: profileId || nanoid(),
      name: profile.name.trim(),
      icon: profile.icon as ProfileIcon,
      color: profile.color as ProfileColor,
      fields: profile.fields || {},
      createdAt: profile.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    await saveProfile(fullProfile);
    setSaving(false);
    onSave();
  };

  const handleDelete = async () => {
    if (profileId && confirm('Delete this profile? This cannot be undone.')) {
      await deleteProfile(profileId);
      onSave();
    }
  };

  if (loading) return null;

  const selectedColor = profile.color as ProfileColor || 'blue';
  const selectedIcon = profile.icon as ProfileIcon || 'user';
  const SelectedIconCmp = ICONS.find(i => i.id === selectedIcon)?.icon || User;

  return (
    <div className="flex flex-col h-full bg-quill-dark-900 animate-fadeIn">

      {/* ── Header ── */}
      <header className="flex items-center gap-2 px-3 pt-4 pb-3 sticky top-0 bg-quill-dark-900 z-10">
        <button
          onClick={onBack}
          className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/6 rounded-lg transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-bold text-slate-100">
          {profileId ? 'Edit profile' : 'New profile'}
        </h1>
      </header>

      {/* ── Body ── */}
      <main className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-24">

        {error && (
          <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Profile identity card */}
        <div className="mb-6 p-4 bg-quill-dark-700 rounded-2xl border border-white/6">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar preview */}
            <div className={clsx(
              'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl flex-shrink-0',
              COLOR_SOLID[selectedColor]
            )}>
              <SelectedIconCmp size={24} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={profile.name || ''}
                onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="Profile name"
                className="w-full bg-transparent text-slate-100 font-bold text-base placeholder:text-slate-600 focus:outline-none border-b border-white/10 focus:border-quill-purple-500/60 pb-1 transition-colors"
              />
              <p className="text-[11px] text-slate-600 mt-1">e.g. Personal, Work — Acme Corp</p>
            </div>
          </div>

          {/* Icon selector */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold mb-2">Icon</p>
            <div className="flex gap-2">
              {ICONS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setProfile(p => ({ ...p, icon: id }))}
                  className={clsx(
                    'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150',
                    profile.icon === id
                      ? `bg-gradient-to-br ${COLOR_SOLID[selectedColor]} text-white shadow-md`
                      : 'bg-quill-dark-600 text-slate-500 hover:text-slate-300 hover:bg-quill-dark-500'
                  )}
                >
                  <Icon size={17} strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold mb-2">Color</p>
            <div className="flex gap-2.5">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setProfile(p => ({ ...p, color: c }))}
                  className={clsx(
                    'w-7 h-7 rounded-full bg-gradient-to-br transition-all duration-150',
                    COLOR_SOLID[c],
                    profile.color === c ? `ring-2 ${COLOR_RING[c]} ring-offset-2 ring-offset-quill-dark-700 scale-110` : 'opacity-50 hover:opacity-80 hover:scale-105'
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <Section title="Personal">
          <FieldRow label="First name"  value={profile.fields?.firstName || ''} onChange={v => updateField('firstName', v)} />
          <FieldRow label="Last name"   value={profile.fields?.lastName  || ''} onChange={v => updateField('lastName',  v)} />
          <FieldRow label="Email" type="email" value={profile.fields?.email || ''} onChange={v => updateField('email', v)} />
          <FieldRow label="Phone" type="tel"   value={profile.fields?.phone || ''} onChange={v => updateField('phone', v)} />
        </Section>

        <Section title="Work">
          <FieldRow label="Company"   value={profile.fields?.company  || ''} onChange={v => updateField('company',  v)} />
          <FieldRow label="Job title" value={profile.fields?.jobTitle || ''} onChange={v => updateField('jobTitle', v)} />
        </Section>

        <Section title="Address">
          <FieldRow label="Address"  value={profile.fields?.address1 || ''} onChange={v => updateField('address1', v)} />
          <FieldRow label="City"     value={profile.fields?.city     || ''} onChange={v => updateField('city',     v)} />
          <div className="flex gap-3">
            <div className="flex-1"><FieldRow label="State" value={profile.fields?.state || ''} onChange={v => updateField('state', v)} /></div>
            <div className="flex-1"><FieldRow label="Zip"   value={profile.fields?.zip   || ''} onChange={v => updateField('zip',   v)} /></div>
          </div>
          <FieldRow label="Country"  value={profile.fields?.country || ''} onChange={v => updateField('country', v)} />
        </Section>

        <Section title="Online">
          <FieldRow label="Website"  type="url" value={profile.fields?.website  || ''} onChange={v => updateField('website',  v)} />
          <FieldRow label="LinkedIn" type="url" value={profile.fields?.linkedin || ''} onChange={v => updateField('linkedin', v)} />
          <FieldRow label="GitHub"   type="url" value={profile.fields?.github   || ''} onChange={v => updateField('github',   v)} />
        </Section>
      </main>

      {/* ── Footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 px-3 pb-3 pt-2 bg-gradient-to-t from-quill-dark-900 via-quill-dark-900/95 to-transparent flex gap-2">
        {profileId && (
          <button
            onClick={handleDelete}
            className="p-3 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/15 rounded-xl transition-all"
            title="Delete profile"
          >
            <Trash2 size={18} />
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm text-white transition-all active:scale-[0.97] disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #534AB7 0%, #7F77DD 50%, #9B8EE8 100%)',
            boxShadow: '0 4px 20px rgba(127, 119, 221, 0.3)',
          }}
        >
          <Save size={16} />
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 mb-3">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold whitespace-nowrap">{title}</p>
        <div className="flex-1 h-px bg-white/5" />
      </div>
      {children}
    </div>
  );
}
