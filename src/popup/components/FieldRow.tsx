import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
}

export function FieldRow({ label, value, onChange, type = 'text', placeholder }: Props) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold pl-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-quill-purple-400 focus:border-transparent transition-shadow"
      />
    </div>
  );
}
