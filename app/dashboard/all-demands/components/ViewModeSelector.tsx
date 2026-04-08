'use client';

import { LayoutList, Kanban } from 'lucide-react';

interface ViewModeSelectorProps {
  viewMode: 'table' | 'kanban';
  onViewModeChange: (mode: 'table' | 'kanban') => void;
}

export default function ViewModeSelector({ viewMode, onViewModeChange }: ViewModeSelectorProps) {
  return (
    <div className="flex gap-2 md:gap-3 w-full md:w-auto">
      <button
        onClick={() => onViewModeChange('table')}
        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base ${
          viewMode === 'table'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <LayoutList size={18} className="md:w-22" />
        <span className="hidden md:inline">Tableau</span>
        <span className="md:hidden">Tableau</span>
      </button>
      <button
        onClick={() => onViewModeChange('kanban')}
        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base ${
          viewMode === 'kanban'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Kanban size={18} className="md:w-22" />
        <span className="hidden md:inline">Kanban</span>
        <span className="md:hidden">Kanban</span>
      </button>
    </div>
  );
}
