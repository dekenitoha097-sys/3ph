'use client';

import { useRef } from 'react';
import { X, Printer, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

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

    const excelData = composants.map((c) => ({
      'Nom': c.nom,
      'Référence': c.reference,
      'Quantité à commander': c.disponibilite,
      'Description': c.description || '-',
      'Lien Image': c.image_url || 'Aucune image',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'À commander');

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Composants_A_Commander_${dateStr}.xlsx`);
  };

  // 2. FONCTION D'IMPRESSION PARFAITE (Via Iframe isolé)
  const handlePrint = () => {
    const printContent = reportRef.current?.innerHTML;
    if (!printContent) return;

    // Création d'un iframe invisible dédié uniquement à l'impression
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Rapport d'impression</title>
          <style>
            body { 
              font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; 
              margin: 30px; 
              color: #111827; 
              background: white; 
            }
            .mb-8 { margin-bottom: 2rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-12 { margin-top: 3rem; }
            .pt-6 { padding-top: 1.5rem; }
            .pb-6 { padding-bottom: 1.5rem; }
            .border-b-2 { border-bottom: 2px solid #111827; }
            .border-t { border-top: 1px solid #d1d5db; }
            .text-3xl { font-size: 1.875rem; font-weight: 700; color: #111827; }
            .text-2xl { font-size: 1.5rem; font-weight: 700; color: #111827; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-700 { color: #374151; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .font-mono { font-family: monospace; font-size: 0.85rem; }
            .italic { font-style: italic; }
            .text-center { text-align: center; }
            
            /* Alignement horizontal propre des blocs de statistiques */
            .grid { display: flex; gap: 1rem; margin-bottom: 2rem; }
            .bg-orange-50 { background-color: #fff7ed; padding: 1rem; border-radius: 0.5rem; flex: 1; border: 1px solid #ffedd5; }
            .bg-red-50 { background-color: #fef2f2; padding: 1rem; border-radius: 0.5rem; flex: 1; border: 1px solid #fee2e2; }
            .text-orange-600 { color: #ea580c; font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
            .text-red-600 { color: #dc2626; font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
            
            /* Design du tableau */
            table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
            th { background-color: #f3f4f6; color: #111827; font-weight: 600; border: 1px solid #d1d5db; padding: 12px; text-align: left; }
            td { border: 1px solid #d1d5db; padding: 12px; text-align: left; vertical-align: middle; color: #374151; }
            .bg-gray-50\\/50 { background-color: #f9fafb; }
            
            /* Ajustement des images */
            img { width: 56px; height: 56px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 4px; background: white; display: block; margin: 0 auto; }
            
            /* Règles de pagination */
            @media print {
              html, body { height: auto; overflow: visible; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              thead { display: table-header-group; } /* Répète les en-têtes sur chaque page */
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exporter en Excel
          </button>
          
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimer le Rapport
          </button>
        </div>

        {/* Zone de prévisualisation à l'écran */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          
          {composants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">Aucun composant à commander pour le moment</p>
            </div>
          ) : (
            /* Ce bloc précis est copié fidèlement pour l'impression */
            <div ref={reportRef} className="bg-white p-8 rounded-lg shadow-sm">
              
              {/* En-tête du Rapport */}
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

              {/* Résumé Statistiques */}
              <div className="grid grid-cols-2 gap-4 mb-8">
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

              {/* Tableau principal */}
              <table className="w-full mb-8 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border border-gray-300">
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900 w-24">
                      Aperçu
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                      Nom
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                      Référence
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900 w-24">
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
                      <td className="border border-gray-300 p-2 text-center align-middle bg-gray-50/50">
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

              {/* Pied de page du rapport */}
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