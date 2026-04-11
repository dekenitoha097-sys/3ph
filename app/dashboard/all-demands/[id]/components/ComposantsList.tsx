'use client';

import { Package, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 rounded-xl shadow-md p-6 md:p-8 border border-indigo-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-600 rounded-lg">
          <Package size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Composants Demandés</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {composants.map((composant) => (
          <div key={composant.id_ligne} className="bg-white rounded-xl p-5 hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden group">
            {/* Image ou placeholder */}
            <div className="mb-4 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              {composant.photo_lien ? (
                <img
                  src={composant.photo_lien}
                  alt={composant.nom}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-5xl">📦</div>
              )}
            </div>

            {/* Détails */}
            <div className="space-y-3">
              <div className="border-b border-gray-100 pb-3">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Composant</p>
                <p className="text-base font-bold text-gray-900 line-clamp-2">{composant.nom}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Référence</p>
                <p className="text-xs font-mono bg-gray-100 text-gray-900 px-2 py-1 rounded inline-block">{composant.reference}</p>
              </div>

              {/* Quantités */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Demandé</p>
                  <p className="text-xl font-bold text-blue-700">{composant.quantite_demandee}</p>
                </div>
                {composant.existe ? (
                  <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Stock</p>
                    <p className="text-xl font-bold text-green-700">{composant.quantite_stock}</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200 flex flex-col justify-center">
                    <Zap size={16} className="text-yellow-600 mb-1" />
                    <p className="text-xs font-semibold text-yellow-700">Nouveau</p>
                  </div>
                )}
              </div>

              {/* Statut Disponibilité */}
              <div className="pt-2">
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-2">Statut</p>
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold ${
                  composant.statut_disponibilite === 'DIS' 
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : composant.statut_disponibilite === 'IND'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : composant.statut_disponibilite === 'EN_ATTENTE'
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}>
                  {composant.statut_disponibilite === 'DIS' ? (
                    <><CheckCircle size={14} /> Dispo</>
                  ) : composant.statut_disponibilite === 'IND' ? (
                    <><AlertCircle size={14} /> Indispo</>
                  ) : composant.statut_disponibilite === 'EN_ATTENTE' ? (
                    <><Clock size={14} /> Attente</>
                  ) : (
                    composant.statut_disponibilite
                  )}
                </span>
              </div>

              {composant.commentaire && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Note</p>
                  <p className="text-xs text-blue-900">{composant.commentaire}</p>
                </div>
              )}
              
              {composant.commentaire_labo && (
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 mt-2">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Commentaire Labo</p>
                  <p className="text-xs text-purple-900">{composant.commentaire_labo}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
