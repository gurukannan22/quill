import React, { useState, useEffect } from 'react';
import { Profile, ProfileColor, ProfileIcon, FieldKey } from '../../storage/types';
import { getProfiles, saveProfile, deleteProfile } from '../../storage/profiles';
import { FieldRow } from '../components/FieldRow';
import { ArrowLeft, User, Building, Briefcase, GraduationCap, Heart, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { clsx } from 'clsx';
import { COLOR_MAP } from '../components/ProfileCard';

interface Props {
  profileId?: string;
  onBack: () => void;
  onSave: () => void;
}

const ICONS: { id: ProfileIcon; icon: any }[] = [
  { id: 'user', icon: User },
  { id: 'building', icon: Building },
  { id: 'briefcase', icon: Briefcase },
  { id: 'school', icon: GraduationCap },
  { id: 'heart', icon: Heart },
];

const COLORS: ProfileColor[] = ['blue', 'purple', 'amber', 'green', 'pink'];

export function ProfileEditor({ profileId, onBack, onSave }: Props) {
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: '',
    icon: 'user',
    color: 'blue',
    fields: {},
  });
  const [loading, setLoading] = useState(!!profileId);
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
    setProfile(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!profile.name?.trim()) {
      setError('Profile name is required');
      return;
    }

    if (profile.fields?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.fields.email)) {
      setError('Invalid email address');
      return;
    }

    const hasData = Object.values(profile.fields || {}).some(v => v?.trim());
    if (!hasData) {
      setError('At least one field must be filled');
      return;
    }

    setError(null);

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
    onSave();
  };

  const handleDelete = async () => {
    if (profileId) {
      if (confirm('Delete this profile?')) {
        await deleteProfile(profileId);
        onSave();
      }
    }
  };

  if (loading) return null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="flex items-center gap-2 px-2 py-3 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-slate-900">
          {profileId ? 'Edit profile' : 'Create profile'}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <section>
            <FieldRow
              label="Profile name"
              value={profile.name || ''}
              onChange={(val) => setProfile(p => ({ ...p, name: val }))}
              placeholder="e.g. Personal, Work — Acme Corp"
            />
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold pl-1 mb-2 block">
              Icon & Color
            </label>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-lg">
                {ICONS.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setProfile(p => ({ ...p, icon: id }))}
                    className={clsx(
                      'p-2 rounded-md transition-colors',
                      profile.icon === id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
                    )}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setProfile(p => ({ ...p, color: c }))}
                    className={clsx(
                      'w-6 h-6 rounded-full border-2 transition-transform',
                      COLOR_MAP[c].bg,
                      profile.color === c ? `scale-110 ${COLOR_MAP[c].border}` : 'border-transparent hover:scale-105'
                    )}
                  />
                ))}
              </div>
            </div>
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold pl-1 mb-3 block border-b pb-1">
              Personal info
            </label>
            <FieldRow label="First name" value={profile.fields?.firstName || ''} onChange={v => updateField('firstName', v)} />
            <FieldRow label="Last name" value={profile.fields?.lastName || ''} onChange={v => updateField('lastName', v)} />
            <FieldRow label="Email" type="email" value={profile.fields?.email || ''} onChange={v => updateField('email', v)} />
            <FieldRow label="Phone" type="tel" value={profile.fields?.phone || ''} onChange={v => updateField('phone', v)} />
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold pl-1 mb-3 block border-b pb-1">
              Work info
            </label>
            <FieldRow label="Company" value={profile.fields?.company || ''} onChange={v => updateField('company', v)} />
            <FieldRow label="Job title" value={profile.fields?.jobTitle || ''} onChange={v => updateField('jobTitle', v)} />
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold pl-1 mb-3 block border-b pb-1">
              Address
            </label>
            <FieldRow label="Address 1" value={profile.fields?.address1 || ''} onChange={v => updateField('address1', v)} />
            <FieldRow label="City" value={profile.fields?.city || ''} onChange={v => updateField('city', v)} />
            <div className="flex gap-3">
              <div className="flex-1">
                <FieldRow label="State/Province" value={profile.fields?.state || ''} onChange={v => updateField('state', v)} />
              </div>
              <div className="flex-1">
                <FieldRow label="Zip/Postal" value={profile.fields?.zip || ''} onChange={v => updateField('zip', v)} />
              </div>
            </div>
            <FieldRow label="Country" value={profile.fields?.country || ''} onChange={v => updateField('country', v)} />
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold pl-1 mb-3 block border-b pb-1">
              Online
            </label>
            <FieldRow label="Website" type="url" value={profile.fields?.website || ''} onChange={v => updateField('website', v)} />
            <FieldRow label="LinkedIn" type="url" value={profile.fields?.linkedin || ''} onChange={v => updateField('linkedin', v)} />
            <FieldRow label="GitHub" type="url" value={profile.fields?.github || ''} onChange={v => updateField('github', v)} />
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-100 flex gap-2">
        {profileId && (
          <button
            onClick={handleDelete}
            className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            title="Delete profile"
          >
            <Trash2 size={20} />
          </button>
        )}
        <button
          onClick={handleSave}
          className="flex-1 bg-slate-900 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-slate-800 transition-colors active:scale-95"
        >
          Save profile
        </button>
      </footer>
    </div>
  );
}
