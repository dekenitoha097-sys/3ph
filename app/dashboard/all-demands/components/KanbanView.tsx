'use client';

import { User, Tag, TrendingUp, Clock } from 'lucide-react';
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

export default function KanbanView({
  demandesByStatus,
  getStatusColor,
  formatDate,
}: KanbanViewProps) {
  const router = useRouter();

  const handleDemandClick = (id: number) => {
    router.push(`/dashboard/all-demands/${id}`);
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Object.entries(demandesByStatus).map(([status, statusDemandes]) => {
          const statusColor = getStatusColor(status);
          return (
            <div 
              key={status} 
              className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200"
            >
              {/* Header */}
              <div className={`${statusColor.bg} px-6 py-4 border-b-4 ${statusColor.text.replace('text-', 'border-')}`}>
                <h3 className={`font-bold ${statusColor.text} text-lg capitalize mb-2`}>
                  {status.replace(/_/g, ' ')}
                </h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColor.badge}`}>
                  {statusDemandes.length} demande{statusDemandes.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[500px]">
                {statusDemandes.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <p className="text-gray-400 text-sm">Aucune demande</p>
                  </div>
                ) : (
                  statusDemandes.map((demande) => (
                    <div
                      key={demande.id_demande}
                      onClick={() => handleDemandClick(demande.id_demande)}
                      className={`${statusColor.bg} rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 transform border-l-4 ${statusColor.text.replace('text-', 'border-')} group`}
                    >
                      {/* Title */}
                      <p className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600">
                        {demande.titre}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{demande.description}</p>

                      {/* Info Grid */}
                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User size={16} className="flex-shrink-0 text-blue-500" />
                          <span className="font-medium truncate">
                            {demande.prenom_etudiant} {demande.nom_etudiant}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Tag size={16} className="flex-shrink-0 text-purple-500" />
                          <span className="font-medium">{demande.code_groupe}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={16} className="flex-shrink-0 text-orange-500" />
                          <span className="font-medium">{formatDate(demande.date_soumission)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <TrendingUp size={14} className="text-green-500" />
                            <span className="text-xs font-bold text-gray-700">{demande.progression}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${demande.progression}%` }}
                          ></div>
                        </div>
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
  );
}
