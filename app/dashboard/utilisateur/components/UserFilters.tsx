'use client';

import { Search, Filter, X } from 'lucide-react';

interface UserFiltersProps {
  filters: {
    nom: string;
    prenom: string;
    email: string;
    role: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const ROLES = [
  { value: 'etudiant', label: 'Étudiant' },
  { value: 'encadrant', label: 'Encadrant' },
  { value: 'laboratoire', label: 'Laboratoire' },
  { value: 'admin', label: 'Admin' },
];

export default function UserFilters({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
}: UserFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
          <Filter size={20} />
          Filtres
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm md:text-base text-blue-600 hover:text-blue-700 font-semibold w-fit"
          >
            <X size={16} />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.nom}
              onChange={(e) => onFilterChange('nom', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Prénom */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.prenom}
              onChange={(e) => onFilterChange('prenom', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Rechercher..."
              value={filters.email}
              onChange={(e) => onFilterChange('email', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Rôle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rôle</label>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
