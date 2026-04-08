'use client';

import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  search: string;
  status: string;
  minQuantite: string;
  maxQuantite: string;
  existe: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMinQuantiteChange: (value: string) => void;
  onMaxQuantiteChange: (value: string) => void;
  onExisteChange: (value: string) => void;
  onReset: () => void;
}

export default function FilterBar({
  search,
  status,
  minQuantite,
  maxQuantite,
  existe,
  onSearchChange,
  onStatusChange,
  onMinQuantiteChange,
  onMaxQuantiteChange,
  onExisteChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Recherche */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            Recherche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Nom ou référence..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Statut Disponibilité */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            Statut
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="DIS">✓ Disponible</option>
            <option value="IND">✕ Indisponible</option>
            <option value="EN_ATTENTE">⏳ En attente</option>
          </select>
        </div>

        {/* Quantité Min */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            Stock min
          </label>
          <input
            type="number"
            placeholder="Min"
            value={minQuantite}
            onChange={(e) => onMinQuantiteChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            min="0"
          />
        </div>

        {/* Quantité Max */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            Stock max
          </label>
          <input
            type="number"
            placeholder="Max"
            value={maxQuantite}
            onChange={(e) => onMaxQuantiteChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            min="0"
          />
        </div>

        {/* Type (Existant/Custom) */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            Type
          </label>
          <select
            value={existe}
            onChange={(e) => onExisteChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tous les types</option>
            <option value="true">Catalog</option>
            <option value="false">Custom</option>
          </select>
        </div>
      </div>

      {/* Bouton Réinitialiser */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
        >
          Réinitialiser filtres
        </button>
      </div>
    </div>
  );
}
