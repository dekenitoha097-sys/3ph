'use client';

import { Edit2, Trash2 } from 'lucide-react';

interface Composant {
  id_composant: number;
  nom: string;
  reference: string;
  image_url: string | null;
  existe: boolean;
  disponibilite: number;
  description: string | null;
  statut_disponibilite: string;
  created_at: string;
}

interface ComposantCardProps extends Composant {
  onEdit: (composant: Composant) => void;
  onDelete: (id: number, nom: string) => void;
}

export default function ComposantCard({
  id_composant,
  nom,
  reference,
  image_url,
  existe,
  disponibilite,
  description,
  statut_disponibilite,
  created_at,
  onEdit,
  onDelete,
}: ComposantCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DIS':
        return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: '✓ Disponible' };
      case 'IND':
        return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: '✕ Indisponible' };
      case 'EN_ATTENTE':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: '⏳ En attente' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', label: '?' };
    }
  };

  const statusStyle = getStatusColor(statut_disponibilite);
  const isIndisponible = statut_disponibilite === 'IND';
  const isCustom = !existe;

  return (
    <div className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Badge Indisponible */}
      {isIndisponible && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          INDISPONIBLE
        </div>
      )}

      {/* Badge Custom */}
      {isCustom && (
        <div className="absolute top-2 left-2 z-10 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          NOUVEAU
        </div>
      )}
      {/* Image */}
      <div className="w-full h-72 bg-gray-100 overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={nom}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Type */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
              existe
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${existe ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
            {existe ? 'Catalog' : 'Custom'}
          </span>
        </div>

        {/* Nom */}
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
          {nom}
        </h3>

        {/* Référence */}
        <p className="text-xs text-gray-600 font-mono mb-3">
          Ref: {reference}
        </p>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Stock */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-600">Stock:</span>
          <span className="text-sm font-bold text-gray-900">
            {disponibilite} unités
          </span>
        </div>

        {/* Statut Disponibilité */}
        <div className="mb-3">
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
            {statusStyle.label}
          </div>
        </div>

        {/* Date création */}
        <p className="text-xs text-gray-500 text-right mb-4">
          {new Date(created_at).toLocaleDateString('fr-FR')}
        </p>

        {/* Boutons d'action */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => onEdit({ id_composant, nom, reference, image_url, existe, disponibilite, description, statut_disponibilite, created_at })}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Modifier
          </button>
          <button
            onClick={() => onDelete(id_composant, nom)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
