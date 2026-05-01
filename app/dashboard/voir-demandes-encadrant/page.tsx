'use client';

import { useState, useEffect } from 'react';
import { FileText, BarChart3 } from 'lucide-react';
import FilterSection from '../all-demands/components/FilterSection';
import ViewModeSelector from '../all-demands/components/ViewModeSelector';
import TableView from '../all-demands/components/TableView';
import KanbanView from '../all-demands/components/KanbanView';
import ContentState from '../all-demands/components/ContentState';

interface Demande {
  id_demande: number;
  titre: string;
  description: string;
  progression: number;
  date_soumission: string;
  date_modification: string;
  status: string;
  id_groupe: number;
  code_groupe: string;
  nom_groupe: string;
  filiere: string;
  annee: string;
  nom_etudiant: string;
  prenom_etudiant: string;
  email_etudiant: string;
}

type ViewMode = 'table' | 'kanban';

export default function VoirDemandesEncadrantPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const [filters, setFilters] = useState({
    filiere: '',
    annee: '',
    status: '',
    search: '',
    date_soumission: '',
  });

  useEffect(() => {
    fetchDemandes();
  }, [filters]);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.filiere) params.append('filiere', filters.filiere);
      if (filters.annee) params.append('annee', filters.annee);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.date_soumission) params.append('date_soumission', filters.date_soumission);

      const response = await fetch(`/api/dashboard/demandes-lab-encadrant?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des demandes');
      }

      const data = await response.json();
      setDemandes(data.demandes);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      filiere: '',
      annee: '',
      status: '',
      search: '',
      date_soumission: '',
    });
  };

  const demandesByStatus = demandes.reduce((acc, demande) => {
    if (!acc[demande.status]) {
      acc[demande.status] = [];
    }
    acc[demande.status].push(demande);
    return acc;
  }, {} as Record<string, Demande[]>);

  const statusColors = {
    'en_attente': { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
    'valide': { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800' },
    'rejete': { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
    'en_cours': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
    'recupere': { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' },
    'pret': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
  } as Record<string, { bg: string; text: string; badge: string }>;

  const getStatusColor = (status: string) => {
    return statusColors[status] || { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const hasActiveFilters = !!(filters.filiere || filters.annee || filters.status || filters.search || filters.date_soumission);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full">
        {/* Header with View Mode Toggle */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-0">
          <div className="flex items-start gap-3 md:gap-4">
            <FileText size={32} className="text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">Demandes Laboratoire & Encadrant</h1>
              <p className="text-base md:text-lg text-gray-600">Voir toutes vos demandes en tant que laboratoire et encadrant</p>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>
        </div>

        {/* Filters */}
        <FilterSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
          userRole="laboratoire"
        />

        {/* Content */}
        <ContentState
          loading={loading}
          error={error}
          demandesCount={demandes.length}
          viewMode={viewMode}
        >
          {viewMode === 'table' ? (
            <TableView demandes={demandes} getStatusColor={getStatusColor} formatDate={formatDate} />
          ) : (
            <KanbanView demandesByStatus={demandesByStatus} getStatusColor={getStatusColor} formatDate={formatDate} />
          )}
        </ContentState>

        {/* Stats Footer */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6 flex items-center gap-4">
          <BarChart3 size={24} className="text-blue-600 flex-shrink-0" />
          <p className="text-base md:text-lg text-gray-700 font-semibold">
            <span className="font-bold text-gray-900 text-lg md:text-xl">{demandes.length}</span> demande(s) affichée(s)
          </p>
        </div>
      </div>
    </div>
  );
}
