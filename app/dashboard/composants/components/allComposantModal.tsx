'use client';

import { useMemo, useRef, useState } from 'react';
import { X, Printer, FileSpreadsheet, Filter } from 'lucide-react';
import { exportToExcel, exportToPrint, generateReportHTML } from '../utils/exportUtils';

interface Composant {
  id_composant: number;
  nom: string;
  reference: string;
  image_url?: string | null;
  photo_lien?: string;
  disponibilite?: number;
  quantite?: number;
  description?: string | null;
  commentaire?: string;
  created_at?: string;
  existe?: 0 | 1 | boolean;
  statut_disponibilite: string;
  type?: 'LABO' | '3PH';
}

interface ComposantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  composants?: Composant[];
}

export default function AllComposantsModal({
  isOpen,
  onClose,
  composants = [],
}: ComposantsModalProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');

  // Sécuriser composants - s'assurer que c'est un array
  const safeComposants: Composant[] = Array.isArray(composants)
    ? composants
    : [];

  const isComposantDisponible = (composant: Composant) => {
    const status = (composant.statut_disponibilite || '').toUpperCase();

    if (status === 'DIS') return true;
    if (status === 'IND' || status === 'NON' || status === 'NON DISPONIBLE' || status === 'NON_DISPONIBLE') return false;

    if (typeof composant.existe === 'boolean') {
      return composant.existe;
    }

    if (typeof composant.existe === 'number') {
      return composant.existe === 1;
    }

    return (composant.disponibilite || composant.quantite || 0) > 0;
  };

  const filteredComposants = useMemo(() => {
    if (availabilityFilter === 'available') {
      return safeComposants.filter(isComposantDisponible);
    }

    if (availabilityFilter === 'unavailable') {
      return safeComposants.filter((composant) => !isComposantDisponible(composant));
    }

    return safeComposants;
  }, [availabilityFilter, safeComposants]);

  const handleExportExcel = () => {
    if (filteredComposants.length === 0) return;

    const excelData = filteredComposants.map((c: Composant) => ({
      'Nom': c.nom,
      'Référence': c.reference,
      'Type': c.type || '-',
      'Quantité': c.disponibilite || c.quantite || '-',
      'Description': c.description || c.commentaire || '-',
      'Statut': c.statut_disponibilite || '-',
    }));

    exportToExcel(
      filteredComposants,
      'Liste_Composants',
      Object.keys(excelData[0] || {}).reduce((acc, key) => {
        acc[key.toLowerCase()] = key;
        return acc;
      }, {} as Record<string, string>)
    );
  };

  const handlePrint = () => {
    if (!reportRef.current) return;

    const stats = [
      {
        label: 'Total composants',
        value: filteredComposants.length,
        color: 'green' as const,
      },
      {
        label: 'Quantité totale',
        value: filteredComposants.reduce((sum: number, c: Composant) => sum + (c.disponibilite || c.quantite || 0), 0),
        color: 'orange' as const,
      },
    ];

    const tableHTML = `
      <table>
        <thead>
            <tr>
              <th style="width: 80px; text-align: center;">Aperçu</th>
              <th>Nom</th>
              <th>Référence</th>
              <th style="width: 100px; text-align: center;">Type</th>
              <th style="width: 100px; text-align: center;">Quantité</th>
              <th>Description</th>
              <th style="width: 100px; text-align: center;">Statut</th>
            </tr>
        </thead>
        <tbody>
          ${filteredComposants
            .map(
              (c: Composant) => `
            <tr>
              <td style="text-align: center; background-color: #f9fafb;">
                ${
                  c.image_url || c.photo_lien
                    ? `<img src="${c.image_url || c.photo_lien}" alt="${c.nom}" style="width: 56px; height: 56px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 4px; margin: 0 auto; display: block;" />`
                    : '<span style="color: #9ca3af; font-size: 0.75rem; font-style: italic;">Aucune</span>'
                }
              </td>
              <td style="font-weight: 600;">${c.nom}</td>
              <td style="font-family: monospace; font-size: 0.85rem;">${c.reference}</td>
              <td style="text-align: center; font-weight: 600; color: #0f766e;">${c.type || '-'}</td>
              <td style="text-align: center; font-weight: bold; color: #16a34a;">${c.disponibilite || c.quantite || '-'}</td>
              <td>${c.description || c.commentaire || '-'}</td>
              <td style="text-align: center;">
                <span style="padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; ${
                  c.statut_disponibilite === 'DIS'
                    ? 'background-color: #dcfce7; color: #166534;'
                    : c.statut_disponibilite === 'IND'
                      ? 'background-color: #fef3c7; color: #92400e;'
                      : 'background-color: #fee2e2; color: #991b1b;'
                }">
                  ${c.statut_disponibilite}
                </span>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    const html = generateReportHTML(
      'Liste des composants du laboratoire',
      stats,
      tableHTML
    );

    exportToPrint(html, 'Liste_Composants');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            Liste des composants ({filteredComposants.length})
          </h3>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Barre d'actions */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Filter size={16} className="text-blue-600" />
            <label htmlFor="availability-filter" className="font-medium">
              Filtrer avant export :
            </label>
            <select
              id="availability-filter"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'unavailable')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tous</option>
              <option value="available">Disponibles</option>
              <option value="unavailable">Non disponibles</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
          <button
            onClick={handleExportExcel}
            disabled={filteredComposants.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exporter Excel
          </button>
          
          <button
            onClick={handlePrint}
            disabled={filteredComposants.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredComposants.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              Aucun composant disponible
            </p>
          ) : (
            <div ref={reportRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredComposants.map((c: Composant) => (
                <div
                  key={c.id_composant}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Image */}
                  {(c.image_url || c.photo_lien) && (
                    <img
                      src={c.image_url || c.photo_lien || ''}
                      alt={c.nom}
                      className="h-32 w-full object-contain mb-3 bg-gray-50 rounded"
                    />
                  )}

                  {/* Infos */}
                  <h4 className="text-lg font-semibold text-gray-900">
                    {c.nom}
                  </h4>

                  <p className="text-sm text-gray-600">
                    Référence : {c.reference}
                  </p>

                  <p className="text-sm text-gray-600">
                    Type : {c.type || '-'}
                  </p>

                  <p className="text-sm text-gray-600">
                    Quantité : {c.disponibilite || c.quantite}
                  </p>

                  {(c.description || c.commentaire) && (
                    <p className="text-sm text-gray-500 mt-2">
                      {c.description || c.commentaire}
                    </p>
                  )}

                  {/* Statut */}
                  <div className="mt-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        c.statut_disponibilite === 'DIS'
                          ? 'bg-green-100 text-green-700'
                          : c.statut_disponibilite === 'IND'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {c.statut_disponibilite}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}