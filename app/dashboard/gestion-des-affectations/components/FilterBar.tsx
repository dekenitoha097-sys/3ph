'use client';

import { Search, X } from 'lucide-react';

interface FilterBarProps {
  searchNom: string;
  searchEmail: string;
  searchGroupe: string;
  searchFiliere: string;
  onNomChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onGroupeChange: (value: string) => void;
  onFiliereChange: (value: string) => void;
  onClear: () => void;
}

export default function FilterBar({
  searchNom,
  searchEmail,
  searchGroupe,
  searchFiliere,
  onNomChange,
  onEmailChange,
  onGroupeChange,
  onFiliereChange,
  onClear,
}: FilterBarProps) {
  const hasActiveFilters = searchNom || searchEmail || searchGroupe || searchFiliere;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nom Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Chercher par nom..."
              value={searchNom}
              onChange={(e) => onNomChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Chercher par email..."
              value={searchEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Groupe Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Groupe
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Chercher par groupe..."
              value={searchGroupe}
              onChange={(e) => onGroupeChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filière Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filière
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Chercher par filière..."
              value={searchFiliere}
              onChange={(e) => onFiliereChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
