'use client';

interface InfoGridProps {
  etudiant: {
    nom: string;
    prenom: string;
    email: string;
  };
  groupe: {
    code_groupe: string;
    nom: string;
    filiere: string;
    annee: string;
  };
  encadrant?: {
    nom: string;
    prenom: string;
  } | null;
  laboratoire?: {
    nom: string;
    email: string;
  } | null;
}

export default function InfoGrid({ etudiant, groupe, encadrant, laboratoire }: InfoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Étudiant */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Étudiant</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 font-semibold">Nom</p>
            <p className="text-base text-gray-900">
              {etudiant.prenom && etudiant.nom 
                ? `${etudiant.prenom} ${etudiant.nom}` 
                : <span className="text-gray-400 italic">Non renseigné</span>
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">Email</p>
            <p className="text-base text-gray-900 break-all">
              {etudiant.email || <span className="text-gray-400 italic">Non renseigné</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Groupe */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Groupe</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 font-semibold">Code</p>
            <p className="text-base text-gray-900">{groupe.code_groupe}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">Filière</p>
            <p className="text-base text-gray-900">{groupe.filiere}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">Année</p>
            <p className="text-base text-gray-900">{groupe.annee}</p>
          </div>
        </div>
      </div>

      {/* Encadrant */}
      {encadrant && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Encadrant</h2>
          <div className="space-y-3">
            <p className="text-base text-gray-900">{encadrant.prenom} {encadrant.nom}</p>
          </div>
        </div>
      )}

      {/* Laboratoire */}
      {laboratoire && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Laboratoire</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Nom</p>
              <p className="text-base text-gray-900">{laboratoire.nom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Email</p>
              <p className="text-base text-gray-900 break-all">{laboratoire.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
