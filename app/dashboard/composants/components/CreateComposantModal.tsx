'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface CreateComposantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateComposantModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateComposantModalProps) {
  const [nom, setNom] = useState('');
  const [reference, setReference] = useState('');
  const [photo_lien, setPhotoLien] = useState('');
  const [quantite, setQuantite] = useState('1');
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!nom.trim()) {
        throw new Error('Le nom est requis');
      }
      if (!reference.trim()) {
        throw new Error('La référence est requise');
      }
      if (!quantite || parseInt(quantite) <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
      }

      const response = await fetch('/api/composants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim(),
          reference: reference.trim(),
          photo_lien: photo_lien.trim() || null,
          quantite: parseInt(quantite),
          commentaire: commentaire.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      // Réinitialiser le formulaire
      setNom('');
      setReference('');
      setPhotoLien('');
      setQuantite('1');
      setCommentaire('');
      setImagePreview(false);
      setError(null);

      // Notifier le parent et fermer
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur serveur';
      setError(errorMessage);
      console.error('Error creating composant:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Ajouter un nouveau composant</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 max-w-2xl">
            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Résistance 10kΩ"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                disabled={loading}
              />
            </div>

            {/* Référence */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Référence <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: RES-10K-0805"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                disabled={loading}
              />
            </div>

            {/* Quantité */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantité <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                disabled={loading}
              />
            </div>

            {/* Lien image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lien image
              </label>
              <input
                type="url"
                value={photo_lien}
                onChange={(e) => setPhotoLien(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                disabled={loading}
              />
              {photo_lien && (
                <>
                  <button
                    type="button"
                    onClick={() => setImagePreview(!imagePreview)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {imagePreview ? 'Masquer' : 'Afficher'} l'aperçu
                  </button>
                  {imagePreview && (
                    <div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={photo_lien}
                        alt="Aperçu"
                        className="max-h-full max-w-full object-contain"
                        onError={() => setError('Impossible de charger l\'image')}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Commentaire
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Notes techniques, caractéristiques..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                disabled={loading}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-lg transition-colors disabled:opacity-50"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading ? 'Création...' : 'Ajouter le composant'}
          </button>
        </div>
      </div>
    </div>
  );
}
