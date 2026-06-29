import React from 'react';
import type { Profile, ProfileColor } from '../../storage/types';
import { User, Building, Briefcase, GraduationCap, Heart, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export const COLOR_MAP: Record<ProfileColor, { accent: string; glow: string; ring: string; dot: string }> = {
  blue:   { accent: 'from-blue-500 to-cyan-500',    glow: 'shadow-blue-500/20',   ring: 'ring-blue-500/40',   dot: 'bg-blue-400' },
  purple: { accent: 'from-violet-500 to-purple-500', glow: 'shadow-violet-500/20', ring: 'ring-violet-500/40', dot: 'bg-violet-400' },
  amber:  { accent: 'from-amber-500 to-orange-500',  glow: 'shadow-amber-500/20',  ring: 'ring-amber-500/40',  dot: 'bg-amber-400' },
  green:  { accent: 'from-emerald-500 to-teal-500',  glow: 'shadow-emerald-500/20',ring: 'ring-emerald-500/40',dot: 'bg-emerald-400' },
  pink:   { accent: 'from-pink-500 to-rose-500',     glow: 'shadow-pink-500/20',   ring: 'ring-pink-500/40',   dot: 'bg-pink-400' },
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
      className={clsx(
        'group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200',
        isSelected
          ? `bg-quill-dark-700 ring-1 ${colors.ring} shadow-lg ${colors.glow}`
          : 'hover:bg-quill-dark-700/60 active:bg-quill-dark-700'
      )}
    >
      {/* Icon Badge */}
      <div className={clsx(
        'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-md',
        colors.accent,
        isSelected && `shadow-lg ${colors.glow}`
      )}>
        <Icon size={18} strokeWidth={2} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isSelected && <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', colors.dot)} />}
          <h3 className="text-sm font-semibold text-slate-100 truncate">{profile.name}</h3>
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {profile.fields.email || profile.fields.phone || profile.fields.company || 'No details added'}
        </p>
      </div>

      {/* Edit button — visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="flex-shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
        title="Edit profile"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
