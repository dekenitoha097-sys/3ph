'use client';

import { User, Tag, TrendingUp, Clock, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface KanbanViewProps {
  demandesByStatus: Record<string, Demande[]>;
  getStatusColor: (status: string) => { bg: string; text: string; badge: string };
  formatDate: (date: string) => string;
}

const STATUS_ORDER = [
  'en_attente',
  'en_revision',
  'valide',
  'pret',
  'recupere'
];

const getStatusIcon = (status: string) => {
  const icons: Record<string, React.ReactNode> = {
    'en_attente': <AlertCircle size={16} />,
    'en_revision': <RefreshCw size={16} />,
    'valide': <CheckCircle2 size={16} />,
    'pret': <CheckCircle2 size={16} />,
    'recupere': <CheckCircle2 size={16} />,
  };
  return icons[status] || null;
};

export default function KanbanView({
  demandesByStatus,
  getStatusColor,
  formatDate,
}: KanbanViewProps) {
  const router = useRouter();


  const handleDemandClick = (id: number) => {
    router.push(`/dashboard/all-demands/${id}`);
  };

  // Trier les colonnes dans l'ordre correct
  const sortedStatuses = STATUS_ORDER.filter(status => demandesByStatus[status]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vue Kanban</h2>
        <p className="text-gray-600">Visualisez et gérez toutes les demandes par statut</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {sortedStatuses.map(status => {
          const count = demandesByStatus[status].length;
          const color = getStatusColor(status);
          return (
            <div 
              key={status} 
              className={`${color.bg} ${color.text} rounded-lg p-3 text-center border border-gray-200 hover:shadow-md transition-shadow`}
            >
              <p className="text-xs font-semibold uppercase opacity-75">{status.replace(/_/g, ' ')}</p>
              <p className="text-2xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-min">
          {sortedStatuses.map((status) => {
            const statusDemandes = demandesByStatus[status];
            const statusColor = getStatusColor(status);
            
            return (
              <div 
                key={status}
                className="flex flex-col w-96 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {/* Column Header */}
                <div className={`${statusColor.bg} px-6 py-5 border-b-4 border-opacity-50`}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${statusColor.badge}`}>
                        {getStatusIcon(status)}
                      </div>
                      <h3 className={`font-bold text-lg ${statusColor.text} capitalize`}>
                        {status.replace(/_/g, ' ')}
                      </h3>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusColor.badge} ${statusColor.text}`}>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-40 mr-1.5 text-xs font-bold">
                      {statusDemandes.length}
                    </span>
                    demande{statusDemandes.length > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[600px] max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {statusDemandes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="text-center">
                        <div className="text-5xl mb-3 opacity-30">📭</div>
                        <p className="text-gray-400 text-sm font-medium">Aucune demande</p>
                      </div>
                    </div>
                  ) : (
                    statusDemandes.map((demande, index) => (
                      <div
                        key={demande.id_demande}
                        onClick={() => handleDemandClick(demande.id_demande)}
                        className={`group rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-gray-200 hover:border-blue-500 bg-white hover:bg-blue-50 transform`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Card Header with Badge */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 flex-1">
                            {demande.titre}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold whitespace-nowrap flex-shrink-0">
                            #{demande.id_demande}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                          {demande.description}
                        </p>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>

                        {/* Info Grid */}
                        <div className="space-y-2.5 mb-4">
                          <div className="flex items-center gap-2 text-gray-700 group-hover:text-blue-600 transition-colors">
                            <User size={14} className="flex-shrink-0 text-blue-500" />
                            <span className="text-xs font-semibold truncate">
                              {demande.prenom_etudiant} {demande.nom_etudiant}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 group-hover:text-blue-600 transition-colors">
                            <Tag size={14} className="flex-shrink-0 text-purple-500" />
                            <span className="text-xs font-semibold">{demande.code_groupe}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 group-hover:text-blue-600 transition-colors">
                            <Clock size={14} className="flex-shrink-0 text-orange-500" />
                            <span className="text-xs font-semibold">{formatDate(demande.date_soumission)}</span>
                          </div>
                        </div>

                        {/* Progress Section */}
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <TrendingUp size={14} className="text-emerald-500 font-bold" />
                              <span className="text-xs font-bold text-gray-700">Progression</span>
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {demande.progression}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-300 shadow-lg"
                              style={{ width: `${demande.progression}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-xs text-gray-600 font-medium">Voir les détails</span>
                          <ArrowRight size={14} className="text-blue-600" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100">
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Total des demandes: <span className="text-blue-600">{Object.values(demandesByStatus).reduce((sum, arr) => sum + arr.length, 0)}</span></p>
            <p className="text-sm text-gray-600">Cliquez sur une carte pour voir les détails</p>
          </div>
        </div>
      </div>
    </div>
  );
}
