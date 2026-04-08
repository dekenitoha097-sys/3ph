'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Composant {
  id_composant: number;
  nom: string;
  reference: string;
  image_url: string | null;
  existe: boolean;
  disponibilite: number;
  description: string;
  statut_disponibilite: string;
  created_at: string;
}

interface EditModalProps {
  composant: Composant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Composant) => void;
}

export default function EditModal({ composant, isOpen, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    reference: '',
    photo_lien: '',
    quantite: 0,
    Statut_Disponibilite: 'DIS',
    commentaire: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour le formulaire quand le composant change
  const handleComposantChange = (newComposant: Composant | null) => {
    if (newComposant) {
      setFormData({
        nom: newComposant.nom,
        reference: newComposant.reference,
        photo_lien: newComposant.image_url || '',
        quantite: newComposant.disponibilite,
        Statut_Disponibilite: newComposant.statut_disponibilite,
        commentaire: newComposant.description || '',
      });
      setError(null);
    }
  };

  // Effect pour mettre à jour le formulaire
  if (composant && formData.nom === '') {
    handleComposantChange(composant);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composant) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/composants/${composant.id_composant}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const updated = await response.json();
      onSave(updated);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur serveur';
      setError(errorMessage);
      console.error('Error updating composant:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !composant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Modifier: {composant.nom}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Contenu */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Nom */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nom du composant *
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Référence */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Référence *
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* URL Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              URL de l'image
            </label>
            <input
              type="text"
              name="photo_lien"
              value={formData.photo_lien}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.photo_lien && (
              <div className="mt-2 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.photo_lien}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                  }}
                />
              </div>
            )}
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Quantité en stock *
            </label>
            <input
              type="number"
              name="quantite"
              value={formData.quantite}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Statut Disponibilité */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Statut de disponibilité *
            </label>
            <select
              name="Statut_Disponibilite"
              value={formData.Statut_Disponibilite}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DIS">✓ Disponible</option>
              <option value="IND">✕ Indisponible</option>
              <option value="EN_ATTENTE">⏳ En attente</option>
            </select>
          </div>

          {/* Description/Commentaire */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description / Commentaire
            </label>
            <textarea
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
