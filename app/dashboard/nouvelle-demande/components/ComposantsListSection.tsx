'use client';

import { Plus, Trash2 } from 'lucide-react';

interface ComposantSelectionne {
  id_composant?: number;
  nom: string;
  reference: string;
  quantite_demandee: number;
  image_url?: string | null;
  isNew?: boolean;
}

interface ComposantsListSectionProps {
  composants: ComposantSelectionne[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdateQuantite: (index: number, quantite: number) => void;
}

export default function ComposantsListSection({
  composants,
  onAdd,
  onRemove,
  onUpdateQuantite,
}: ComposantsListSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Composants ({composants.length})</h2>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          Ajouter un composant
        </button>
      </div>

      {composants.length === 0 ? (
        <p className="text-gray-500 italic text-center py-8">Aucun composant sélectionné</p>
      ) : (
        <div className="space-y-3">
          {composants.map((comp, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {comp.image_url ? (
                    <img src={comp.image_url} alt={comp.nom} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xl">📦</div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{comp.nom}</p>
                    <p className="text-sm text-gray-500">{comp.reference}</p>
                    {comp.isNew && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                        Nouveau
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantite(idx, comp.quantite_demandee - 1)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={comp.quantite_demandee}
                    onChange={(e) => onUpdateQuantite(idx, parseInt(e.target.value) || 1)}
                    className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateQuantite(idx, comp.quantite_demandee + 1)}
                    className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
