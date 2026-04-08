'use client';

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

interface TableViewProps {
  demandes: Demande[];
  getStatusColor: (status: string) => { bg: string; text: string; badge: string };
  formatDate: (date: string) => string;
}

export default function TableView({ demandes, getStatusColor, formatDate }: TableViewProps) {
  const router = useRouter();

  const handleDemandClick = (id: number) => {
    router.push(`/dashboard/all-demands/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-base">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-2 md:px-8 py-3 md:py-5 text-left text-xs md:text-sm font-bold text-gray-700 uppercase">Titre</th>
              <th className="hidden md:table-cell px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Étudiant</th>
              <th className="hidden lg:table-cell px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Groupe</th>
              <th className="hidden lg:table-cell px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Filière</th>
              <th className="px-2 md:px-8 py-3 md:py-5 text-left text-xs md:text-sm font-bold text-gray-700 uppercase">Status</th>
              <th className="hidden md:table-cell px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase">Progression</th>
              <th className="px-2 md:px-8 py-3 md:py-5 text-left text-xs md:text-sm font-bold text-gray-700 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande, index) => {
              const statusColor = getStatusColor(demande.status);
              return (
                <tr
                  key={demande.id_demande}
                  onClick={() => handleDemandClick(demande.id_demande)}
                  className={`border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-2 md:px-8 py-3 md:py-6">
                    <p className="font-bold text-gray-900 truncate text-xs md:text-base">{demande.titre}</p>
                    <p className="text-xs text-gray-600 truncate mt-1">{demande.description}</p>
                  </td>
                  <td className="hidden md:table-cell px-8 py-6 whitespace-nowrap">
                    <p className="text-base font-semibold text-gray-900">
                      {demande.prenom_etudiant} {demande.nom_etudiant}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{demande.email_etudiant}</p>
                  </td>
                  <td className="hidden lg:table-cell px-8 py-6 whitespace-nowrap">
                    <span className="text-base font-semibold text-gray-900">{demande.code_groupe}</span>
                  </td>
                  <td className="hidden lg:table-cell px-8 py-6 whitespace-nowrap">
                    <span className="text-base text-gray-700 font-medium">{demande.filiere}</span>
                  </td>
                  <td className="px-2 md:px-8 py-3 md:py-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold ${statusColor.badge}`}>
                      {demande.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-24 md:w-32 bg-gray-300 rounded-full h-2 md:h-3">
                        <div
                          className="bg-blue-600 h-2 md:h-3 rounded-full transition-all"
                          style={{ width: `${demande.progression}%` }}
                        ></div>
                      </div>
                      <span className="text-base font-bold text-gray-700 w-10">{demande.progression}%</span>
                    </div>
                  </td>
                  <td className="px-2 md:px-8 py-3 md:py-6 whitespace-nowrap text-xs md:text-base font-medium text-gray-700">
                    {formatDate(demande.date_soumission)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
