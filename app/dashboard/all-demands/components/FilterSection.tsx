'use client';

import { Search, Filter, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterSectionProps {
  filters: {
    filiere: string;
    annee: string;
    status: string;
    search: string;
    date_soumission: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  userRole?: string;
}

export default function FilterSection({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
  userRole = '',
}: FilterSectionProps) {
  const isStudent = userRole === 'etudiant';
  const gridColsClass = isStudent ? 'lg:grid-cols-3' : 'lg:grid-cols-5';

  const [libelle,setLibelle] = useState<string[]>([]);
  const [filiere, setFiliere] = useState<string[]>([]);
  const [annee, setAnnee] = useState<string[]>([]);

  useEffect(() => {
    async function fetchStatus(){
      try {
        const res = await fetch("/api/utils/status")
        const data = await res.json();
        const statusLibelles = data.status.map((s: { libelle: string }) => s.libelle);
        setLibelle(statusLibelles);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    }
    fetchStatus();
  },[libelle])

  useEffect(() => {
    async function fetchFiliere(){
      try {
        const res = await fetch("/api/utils/filiers")
        const data = await res.json();
        const filiereNames = data.map((f: { filiere: string }) => f.filiere);
        setFiliere(filiereNames);
      } catch (error) {
        console.error('Error fetching filieres:', error);
      }
    }
    fetchFiliere();
  },[])

  useEffect(() => {
    async function fetchAnnee(){
      try {
        const res = await fetch("/api/utils/annee")
        const data = await res.json();
        const anneeNames  = data.map((f: { annee: string }) => f.annee);
        setAnnee(anneeNames);
      } catch (error) {
        console.error('Error fetching années:', error);
      }
    }
    fetchAnnee();
  },[])

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-2 md:gap-0">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
          <Filter size={20} className="md:w-6 md:h-6" />
          Filtres
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm md:text-base text-blue-600 hover:text-blue-700 font-semibold w-fit"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-3 md:gap-5`}>
        {/* Recherche */}
        <div>
          <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">Recherche</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 md:left-4 top-2 md:top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Titre, description..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filière - Masqué pour les étudiants */}
        {!isStudent && (
          <div>
            <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">Filière</label>
            <select
              value={filters.filiere}
              onChange={(e) => onFilterChange('filiere', e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              {filiere.map((fil: string) => (
                <option key={fil} value={fil}>{fil}</option>
              ))
              }
            </select>
          </div>
        )}

        {/* Année - Masqué pour les étudiants */}
        {!isStudent && (
          <div>
            <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">Année</label>
            <select
              value={filters.annee}
              onChange={(e) => onFilterChange('annee', e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              {annee.map((a: string) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            {
              libelle.map((lib: string) => (
                <option key={lib} value={lib}>{lib}</option>
              ))
            }
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">Date soumission</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 md:left-4 top-2 md:top-4 text-gray-400" />
            <input
              type="date"
              value={filters.date_soumission}
              onChange={(e) => onFilterChange('date_soumission', e.target.value)}
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
