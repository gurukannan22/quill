import React from 'react';
import { FileEdit } from 'lucide-react';

interface Props {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="bg-quill-purple-50 text-quill-purple-600 p-3 rounded-full mb-4">
        <FileEdit size={24} />
      </div>
      <h3 className="text-sm font-medium text-slate-900 mb-1">No profiles yet</h3>
      <p className="text-xs text-slate-500 mb-5">
        Create your first profile to start filling forms instantly.
      </p>
      <button
        onClick={onCreateClick}
        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors active:scale-95"
      >
        Create profile
      </button>
    </div>
  );
}
