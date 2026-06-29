import { StorageSchema, Profile } from './types';

const KEY = 'quill_data';

const DEFAULT_DATA: StorageSchema = {
  profiles: [],
  activeProfileId: null,
  settings: {
    highlightFilled: true,
    autoDetectForms: true,
    showFieldCount: true,
  },
};

export async function getData(): Promise<StorageSchema> {
  try {
    const result = await chrome.storage.local.get(KEY);
    return { ...DEFAULT_DATA, ...(result[KEY] ?? {}) };
  } catch (e) {
    console.error('Failed to get data from storage', e);
    return DEFAULT_DATA;
  }
}

export async function setData(data: StorageSchema): Promise<void> {
  await chrome.storage.local.set({ [KEY]: data });
}

export async function getProfiles(): Promise<Profile[]> {
  const data = await getData();
  return data.profiles;
}

export async function saveProfile(profile: Profile): Promise<void> {
  const data = await getData();
  const idx = data.profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) {
    data.profiles[idx] = { ...profile, updatedAt: Date.now() };
  } else {
    data.profiles.push({ ...profile, createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  if (!data.activeProfileId) {
    data.activeProfileId = profile.id;
  }
  
  await setData(data);
}

export async function deleteProfile(id: string): Promise<void> {
  const data = await getData();
  data.profiles = data.profiles.filter(p => p.id !== id);
  if (data.activeProfileId === id) {
    data.activeProfileId = data.profiles[0]?.id ?? null;
  }
  await setData(data);
}

export async function exportJSON(): Promise<string> {
  const data = await getData();
  return JSON.stringify({ profiles: data.profiles }, null, 2);
}

export async function importJSON(json: string): Promise<void> {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed?.profiles)) throw new Error('Invalid format');
  const data = await getData();
  // Merge: imported profiles overwrite by id, new ones are appended
  for (const incoming of parsed.profiles) {
    if (!incoming.id || !incoming.name || typeof incoming.fields !== 'object') continue;
    const idx = data.profiles.findIndex((p: Profile) => p.id === incoming.id);
    if (idx >= 0) data.profiles[idx] = incoming;
    else data.profiles.push(incoming);
  }
  
  if (!data.activeProfileId && data.profiles.length > 0) {
    data.activeProfileId = data.profiles[0].id;
  }
  
  await setData(data);
}

export async function updateSettings(settings: Partial<StorageSchema['settings']>): Promise<void> {
  const data = await getData();
  data.settings = { ...data.settings, ...settings };
  await setData(data);
}

export async function setActiveProfileId(id: string): Promise<void> {
  const data = await getData();
  data.activeProfileId = id;
  await setData(data);
}
