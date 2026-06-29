import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fadeIn">
      {/* Glowing orb */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-quill-purple-600/30 rounded-full blur-xl scale-150" />
        <div className="relative w-16 h-16 bg-gradient-to-br from-quill-purple-500 to-violet-600 rounded-[24px] flex items-center justify-center shadow-xl shadow-quill-purple-900/40">
          <Sparkles size={28} className="text-white" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-100 mb-2">No profiles yet</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-[200px]">
        Create a profile to start filling any web form in one click.
      </p>

      <button
        onClick={onCreateClick}
        className="px-5 py-2.5 bg-gradient-to-r from-quill-purple-600 to-violet-600 text-white rounded-[16px] text-sm font-semibold hover:from-quill-purple-500 hover:to-violet-500 transition-all duration-200 active:scale-95 shadow-lg shadow-quill-purple-900/40"
      >
        Create first profile
      </button>
    </div>
  );
}
