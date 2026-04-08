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
    <div className="w-full">
      <div className="grid gap-3 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Object.entries(demandesByStatus).map(([status, statusDemandes]) => {
          const statusColor = getStatusColor(status);
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-auto sm:h-[600px] md:h-[800px]">
              <div className={`${statusColor.bg} px-3 md:px-6 py-3 md:py-5 border-b-2 border-gray-200`}>
                <h3 className={`font-bold ${statusColor.text} text-sm md:text-base capitalize mb-1`}>
                  {status.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs md:text-sm font-semibold text-gray-600">{statusDemandes.length} demande(s)</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4">
                {statusDemandes.map((demande) => (
                  <div
                    key={demande.id_demande}
                    onClick={() => handleDemandClick(demande.id_demande)}
                    className={`${statusColor.bg} border-l-4 ${statusColor.text.replace('text-', 'border-')} rounded-lg p-3 md:p-4 cursor-pointer hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-bold text-gray-900 text-xs md:text-base line-clamp-2 flex-1">{demande.titre}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${statusColor.badge}`}>
                        {demande.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{demande.description}</p>

                    <div className="mt-2 md:mt-3 space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <User size={14} className="md:w-4 md:h-4" />
                        <span className="truncate font-medium text-xs md:text-sm">
                          {demande.prenom_etudiant} {demande.nom_etudiant}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="md:w-4 md:h-4" />
                        <span className="font-medium text-xs md:text-sm">{demande.code_groupe}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="md:w-4 md:h-4" />
                        <span className="font-medium text-xs md:text-sm">{demande.progression}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="md:w-4 md:h-4" />
                        <span className="font-medium text-xs md:text-sm">{formatDate(demande.date_soumission)}</span>
                      </div>
                    </div>

                    <div className="mt-2 md:mt-3 w-full bg-gray-300 rounded-full h-1 md:h-2">
                      <div
                        className="bg-blue-600 h-1 md:h-2 rounded-full transition-all"
                        style={{ width: `${demande.progression}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
