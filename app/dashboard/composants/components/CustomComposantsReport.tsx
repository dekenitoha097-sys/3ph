'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, FileText, Printer } from 'lucide-react';

interface CustomComposant {
  id_composant: number;
  nom: string;
  reference: string;
  image_url: string | null;
  disponibilite: number;
  description: string;
  statut_disponibilite: string;
  created_at: string;
}

export default function CustomComposantsReport() {
  const [composants, setComposants] = useState<CustomComposant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Charger les composants custom
  useEffect(() => {
    const fetchCustomComposants = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/composants/custom');

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des composants');
        }

        const data = await response.json();
        setComposants(data.composants || []);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur serveur';
        setError(errorMessage);
        console.error('Error fetching custom composants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomComposants();
  }, []);

  // Imprimer la page
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (composants.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Aucun composant custom pour le moment</p>
      </div>
    );
  }

  return (
    <div>
      {/* Styles pour l'impression */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .report-container {
            box-shadow: none !important;
            page-break-inside: avoid;
          }
          table {
            page-break-inside: avoid;
            border-collapse: collapse;
          }
          tr, td {
            page-break-inside: avoid;
          }
          h2 {
            page-break-after: avoid;
            margin-top: 2rem;
          }
          .image-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Bouton Imprimer */}
      <div className="mb-6 flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimer
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Rapport imprimable */}
      <div
        ref={reportRef}
        className="report-container bg-white p-8 rounded-lg shadow-lg"
      >
        {/* En-tête */}
        <div className="mb-8 border-b-2 border-gray-900 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Rapport des composants custom</h1>
          <p className="text-gray-600 mt-2">
            Généré le {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Résumé */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Total composants</p>
            <p className="text-2xl font-bold text-blue-600">{composants.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Quantité totale</p>
            <p className="text-2xl font-bold text-green-600">
              {composants.reduce((sum, c) => sum + c.disponibilite, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-medium">Date rapport</p>
            <p className="text-lg font-bold text-purple-600">
              {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Tableau des composants */}
        <table className="w-full mb-8 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border border-gray-300">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                Nom
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                Référence
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                Quantité
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                Statut
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {composants.map((composant) => (
              <tr key={composant.id_composant} className="border border-gray-300 hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                  {composant.nom}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700 font-mono text-sm">
                  {composant.reference}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center font-bold text-blue-600">
                  {composant.disponibilite}
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      composant.statut_disponibilite === 'DIS'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {composant.statut_disponibilite === 'DIS' ? 'Disponible' : 'Indéterminé'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-700 text-sm">
                  {composant.description || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Images des composants */}
        {composants.some((c) => c.image_url) && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-gray-900 pb-3">
              Images des composants
            </h2>
            <div className="image-grid">
              {composants.map(
                (composant) =>
                  composant.image_url && (
                    <div key={composant.id_composant}>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <img
                          src={composant.image_url}
                          alt={composant.nom}
                          className="w-full h-64 object-contain bg-gray-50"
                        />
                      </div>
                      <p className="mt-2 font-semibold text-gray-900">{composant.nom}</p>
                      <p className="text-gray-600 text-sm">{composant.reference}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        {/* Pied de page */}
        <div className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
          <p>Document généré automatiquement - ESTIM Système de gestion</p>
          <p>© 2026 - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}
