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
    <div className="flex flex-col gap-1.5 mb-3">
      <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold pl-0.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-quill-dark-700 border border-white/8 rounded-[14px] text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-quill-purple-500/60 focus:border-quill-purple-500/40 transition-all duration-150"
      />
    </div>
  );
}
