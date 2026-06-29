import React from 'react';
import type { Profile, ProfileColor } from '../../storage/types';
import { User, Building, Briefcase, GraduationCap, Heart, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const COLOR_MAP: Record<ProfileColor, { bg: string; text: string; border: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300' },
  purple: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-300' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300' },
  green:  { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-300' },
  pink:   { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-300' },
};

const IconMap = {
  user: User,
  building: Building,
  briefcase: Briefcase,
  school: GraduationCap,
  heart: Heart,
};

interface Props {
  profile: Profile;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function ProfileCard({ profile, isSelected, onClick, onEdit }: Props) {
  const Icon = IconMap[profile.icon] || User;
  const colors = COLOR_MAP[profile.color];

  return (
    <div
      onClick={onClick}
      className={twMerge(
        'relative flex items-center p-3 rounded-xl border transition-all duration-150 cursor-pointer',
        isSelected 
          ? `border-quill-purple-400 bg-quill-purple-50 shadow-sm ring-1 ring-quill-purple-400`
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      )}
    >
      <div className={clsx('flex-shrink-0 p-2 rounded-lg', colors.bg, colors.text)}>
        <Icon size={20} />
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-900 truncate pr-2">{profile.name}</h3>
          {isSelected && <CheckCircle2 size={16} className="text-quill-purple-600 flex-shrink-0" />}
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {profile.fields.email || profile.fields.phone || 'No contact info'}
        </p>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="absolute inset-y-0 right-0 px-3 hidden group-hover:flex items-center text-slate-400 hover:text-slate-600"
      >
        Edit
      </button>
    </div>
  );
}
