'use client';

interface ComposantItem {
  id_ligne: number;
  id_composant: number;
  nom: string;
  reference: string;
  photo_lien: string | null;
  quantite_demandee: number;
  quantite_stock: number;
  existe: boolean | null;
  statut_disponibilite: string;
  commentaire_labo: string | null;
  commentaire: string;
}

interface ComposantsListProps {
  composants: ComposantItem[];
}

export default function ComposantsList({ composants }: ComposantsListProps) {
  if (!composants || composants.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Composants Demandés</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {composants.map((composant) => (
          <div key={composant.id_ligne} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            {/* Image ou placeholder */}
            <div className="mb-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              {composant.photo_lien ? (
                <img
                  src={composant.photo_lien}
                  alt={composant.nom}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-4xl">📦</span>
              )}
            </div>

            {/* Détails */}
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Nom</p>
                <p className="text-base font-bold text-gray-900">{composant.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Référence</p>
                <p className="text-sm text-gray-900">{composant.reference}</p>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Demandé</p>
                  <p className="text-base font-bold text-blue-600">{composant.quantite_demandee}</p>
                </div>
                {
                  
                composant.existe ? (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Stock</p>
                    <p className="text-base font-bold text-gray-900">{composant.quantite_stock}</p>
                  </div>
                ) : (
                  <div className="bg-amber-50 px-3 py-1 rounded border border-amber-200">
                    <p className="text-xs font-semibold text-amber-700">Nouveau composant </p>
                    <p className="text-xs text-amber-600">Pas en stock</p>
                  </div>
                )}
              </div>

              {/* Statut Disponibilité */}
              <div className="mt-2">
                <p className="text-sm text-gray-600 font-semibold mb-1">Statut</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  composant.statut_disponibilite === 'DIS' 
                    ? 'bg-green-100 text-green-700'
                    : composant.statut_disponibilite === 'IND'
                    ? 'bg-red-100 text-red-700'
                    : composant.statut_disponibilite === 'EN_ATTENTE'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    composant.statut_disponibilite === 'DIS' ? 'bg-green-500' :
                    composant.statut_disponibilite === 'IND' ? 'bg-red-500' :
                    composant.statut_disponibilite === 'EN_ATTENTE' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></span>
                  {composant.statut_disponibilite === 'DIS' ? '✓ Disponible' :
                   composant.statut_disponibilite === 'IND' ? '✕ Indisponible' :
                   composant.statut_disponibilite === 'EN_ATTENTE' ? '⏳ En attente' :
                   composant.statut_disponibilite}
                </span>
              </div>

              {composant.commentaire && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Commentaire</p>
                  <p className="text-sm text-gray-700">{composant.commentaire}</p>
                </div>
              )}
              {composant.commentaire_labo && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold">Commentaire Labo</p>
                  <p className="text-sm text-blue-900">{composant.commentaire_labo}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
