'use client';

interface HistoriqueSectionProps {
  dateSoumission: string;
  dateModification: string;
}

export default function HistoriqueSection({ dateSoumission, dateModification }: HistoriqueSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Historique</h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 font-semibold">Soumise le</p>
          <p className="text-base text-gray-900">
            {new Date(dateSoumission).toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">Modifiée le</p>
          <p className="text-base text-gray-900">
            {new Date(dateModification).toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
