'use client';

import { useRef } from 'react';
import { X, Printer, FileSpreadsheet } from 'lucide-react';
import { exportToExcel, exportToPrint, generateReportHTML } from '../utils/exportUtils';

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

  // 1. FONCTION D'EXPORTATION EXCEL
  const handleExportExcel = () => {
    if (composants.length === 0) return;

    exportToExcel(
      composants,
      `Composants_A_Commander_${new Date().toISOString().split('T')[0]}.xlsx`,
      {
        'nom': 'Nom',
        'reference': 'Référence',
        'disponibilite': 'Quantité à commander',
        'description': 'Description',
        'image_url': 'Lien Image',
      }
    );
  };

  // 2. FONCTION D'IMPRESSION
  const handlePrint = () => {
    if (!reportRef.current) return;

    const stats = [
      {
        label: 'Total composants à commander',
        value: composants.length,
        color: 'orange' as const,
      },
      {
        label: 'Quantité totale à commander',
        value: composants.reduce((sum, c) => sum + c.disponibilite, 0),
        color: 'red' as const,
      },
    ];

    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th style="width: 100px; text-align: center;">Aperçu</th>
            <th>Nom</th>
            <th>Référence</th>
            <th style="width: 100px; text-align: center;">Quantité</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${composants
            .map(
              (composant) => `
            <tr>
              <td style="text-align: center; background-color: #f9fafb;">
                ${
                  composant.image_url
                    ? `<img src="${composant.image_url}" alt="${composant.nom}" style="width: 56px; height: 56px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 4px; margin: 0 auto; display: block;" />`
                    : '<span style="color: #9ca3af; font-size: 0.75rem; font-style: italic;">Aucune</span>'
                }
              </td>
              <td style="font-weight: 600; color: #111827;">${composant.nom}</td>
              <td style="font-family: monospace; font-size: 0.85rem; color: #374151;">${composant.reference}</td>
              <td style="text-align: center; font-weight: bold; color: #ea580c;">${composant.disponibilite}</td>
              <td style="color: #374151; font-size: 0.875rem;">${composant.description || '-'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    const html = generateReportHTML(
      'Rapport des composants à commander',
      stats,
      tableHTML
    );

    exportToPrint(html, 'Composants_A_Commander');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header Écran */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Composants à commander</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Barre d'actions Écran */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleExportExcel}
            disabled={composants.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exporter Excel
          </button>
          
          <button
            onClick={handlePrint}
            disabled={composants.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>

        {/* Zone de prévisualisation à l'écran */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {composants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">Aucun composant à commander pour le moment</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              
              {/* Tableau principal */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-center font-semibold text-gray-900" style={{ width: '100px' }}>
                      Aperçu
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Nom
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Référence
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900" style={{ width: '100px' }}>
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {composants.map((composant) => (
                    <tr
                      key={composant.id_composant}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-center align-middle bg-gray-50/50">
                        {composant.image_url ? (
                          <img
                            src={composant.image_url}
                            alt={composant.nom}
                            className="w-14 h-14 object-contain mx-auto rounded border border-gray-200 bg-white"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs italic">Aucune</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {composant.nom}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-sm">
                        {composant.reference}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-orange-600">
                        {composant.disponibilite}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {composant.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}