export type FieldKey =
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'email'
  | 'phone'
  | 'company'
  | 'jobTitle'
  | 'address1'
  | 'address2'
  | 'city'
  | 'state'
  | 'zip'
  | 'country'
  | 'website'
  | 'linkedin'
  | 'github'
  | 'twitter';

export interface Profile {
  id: string;            // nanoid, e.g. "abc123"
  name: string;          // Display name: "Personal", "Work — TCS"
  icon: ProfileIcon;     // "user" | "building" | "briefcase" | "school" | "heart"
  color: ProfileColor;   // "blue" | "purple" | "amber" | "green" | "pink"
  fields: Partial<Record<FieldKey, string>>;
  createdAt: number;     // Date.now()
  updatedAt: number;
}

export type ProfileIcon = 'user' | 'building' | 'briefcase' | 'school' | 'heart';
export type ProfileColor = 'blue' | 'purple' | 'amber' | 'green' | 'pink';

export interface StorageSchema {
  profiles: Profile[];
  activeProfileId: string | null;
  settings: {
    highlightFilled: boolean;      // Show blue ring on filled fields
    autoDetectForms: boolean;      // Badge the icon when a form is detected
    showFieldCount: boolean;       // Show "N fields detected" in popup footer
  };
}
