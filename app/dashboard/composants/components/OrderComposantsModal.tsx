'use client';

import { useRef } from 'react';
import { X, Printer } from 'lucide-react';

interface ComposantToOrder {
  id_composant: number;
  nom: string;
  reference: string;
  image_url: string | null;
  disponibilite: number;
  description: string | null;
  created_at: string;
}

interface OrderComposantsModalProps {
  isOpen: boolean;
  composants: ComposantToOrder[];
  onClose: () => void;
}

export default function OrderComposantsModal({
  isOpen,
  composants,
  onClose,
}: OrderComposantsModalProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 no-print">
          <h3 className="text-2xl font-bold text-gray-900">Composants à commander</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Bouton Imprimer */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-end no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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

          {composants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucun composant à commander pour le moment</p>
            </div>
          ) : (
            <div ref={reportRef} className="report-container bg-white">
              {/* En-tête */}
              <div className="mb-8 border-b-2 border-gray-900 pb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Rapport des composants à commander
                </h1>
                <p className="text-gray-600 mt-2">
                  Généré le{' '}
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Résumé */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium">
                    Total composants à commander
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {composants.length}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm font-medium">
                    Quantité totale à commander
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {composants.reduce((sum, c) => sum + c.disponibilite, 0)}
                  </p>
                </div>
              </div>

              {/* Tableau */}
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
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {composants.map((composant) => (
                    <tr
                      key={composant.id_composant}
                      className="border border-gray-300 hover:bg-gray-50"
                    >
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                        {composant.nom}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700 font-mono text-sm">
                        {composant.reference}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-bold text-orange-600">
                        {composant.disponibilite}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700 text-sm">
                        {composant.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Images */}
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
                                className="w-full h-48 object-contain bg-gray-50"
                              />
                            </div>
                            <p className="mt-2 font-semibold text-gray-900">
                              {composant.nom}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {composant.reference}
                            </p>
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
          )}
        </div>
      </div>
    </div>
  );
}
