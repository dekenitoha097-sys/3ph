import * as XLSX from 'xlsx';

export interface ExportComposant {
  id_composant: number;
  nom: string;
  reference: string;
  image_url?: string | null;
  disponibilite?: number;
  quantite?: number;
  description?: string | null;
  commentaire?: string;
  photo_lien?: string;
  statut_disponibilite?: string;
  [key: string]: any;
}

/**
 * Export les composants en Excel
 */
export const exportToExcel = (
  composants: ExportComposant[],
  filename: string,
  columns?: { [key: string]: string }
) => {
  if (composants.length === 0) return;

  const excelData = composants.map((c) => {
    if (columns) {
      return Object.entries(columns).reduce((acc, [key, label]) => {
        acc[label] = c[key] || '-';
        return acc;
      }, {} as Record<string, any>);
    }
    return {
      'Nom': c.nom,
      'Référence': c.reference,
      'Quantité': c.disponibilite || c.quantite || '-',
      'Description': c.description || c.commentaire || '-',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Auto-ajustement de la largeur des colonnes
  const colWidths = Object.keys(excelData[0] || {}).map(() => 20);
  worksheet['!cols'] = colWidths.map(w => ({ wch: w }));
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Composants');

  const dateStr = new Date().toISOString().split('T')[0];
  const finalFilename = filename.includes('.xlsx') ? filename : `${filename}_${dateStr}.xlsx`;
  XLSX.writeFile(workbook, finalFilename);
};

/**
 * Fonction d'impression avec HTML personnalisé
 */
export const exportToPrint = (
  htmlContent: string,
  title: string = 'Rapport d\'impression'
) => {
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
        <title>${title}</title>
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
          .grid { display: flex; gap: 1rem; margin-bottom: 2rem; }
          .bg-orange-50 { background-color: #fff7ed; padding: 1rem; border-radius: 0.5rem; flex: 1; border: 1px solid #ffedd5; }
          .bg-red-50 { background-color: #fef2f2; padding: 1rem; border-radius: 0.5rem; flex: 1; border: 1px solid #fee2e2; }
          .bg-green-50 { background-color: #f0fdf4; padding: 1rem; border-radius: 0.5rem; flex: 1; border: 1px solid #dcfce7; }
          .text-orange-600 { color: #ea580c; font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
          .text-red-600 { color: #dc2626; font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
          .text-green-600 { color: #16a34a; font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
          th { background-color: #f3f4f6; color: #111827; font-weight: 600; border: 1px solid #d1d5db; padding: 12px; text-align: left; }
          td { border: 1px solid #d1d5db; padding: 12px; text-align: left; vertical-align: middle; color: #374151; }
          .bg-gray-50\\/50 { background-color: #f9fafb; }
          img { width: 56px; height: 56px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 4px; background: white; display: block; margin: 0 auto; }
          @media print {
            html, body { height: auto; overflow: visible; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
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

/**
 * Génère le HTML pour l'affichage du rapport
 */
export const generateReportHTML = (
  title: string,
  stats: { label: string; value: string | number; color: 'orange' | 'red' | 'green' }[],
  tableHTML: string,
  footer: string = 'Document généré automatiquement - ESTIM Système de gestion'
): string => {
  return `
    <div style="max-width: 100%; padding: 2rem; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;">
      <div style="margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #111827;">
        <h1 style="font-size: 1.875rem; font-weight: 700; color: #111827; margin: 0;">
          ${title}
        </h1>
        <p style="color: #4b5563; margin-top: 0.5rem; margin-bottom: 0;">
          Généré le ${new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
        </p>
      </div>

      <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
        ${stats
          .map(
            (stat) => `
          <div style="background-color: ${
              stat.color === 'orange'
                ? '#fff7ed'
                : stat.color === 'red'
                  ? '#fef2f2'
                  : '#f0fdf4'
            }; padding: 1rem; border-radius: 0.5rem; flex: 1; border: 1px solid ${
              stat.color === 'orange'
                ? '#ffedd5'
                : stat.color === 'red'
                  ? '#fee2e2'
                  : '#dcfce7'
            }; min-width: 200px;">
            <p style="color: #4b5563; font-size: 0.875rem; font-weight: 500; margin: 0;">
              ${stat.label}
            </p>
            <p style="color: ${
              stat.color === 'orange'
                ? '#ea580c'
                : stat.color === 'red'
                  ? '#dc2626'
                  : '#16a34a'
            }; font-size: 1.5rem; font-weight: 700; margin-top: 0.25rem; margin-bottom: 0;">
              ${stat.value}
            </p>
          </div>
        `
          )
          .join('')}
      </div>

      ${tableHTML}

      <div style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #d1d5db; text-align: center; color: #4b5563; font-size: 0.875rem;">
        <p style="margin: 0;">${footer}</p>
        <p style="margin: 0;">© 2026 - Tous droits réservés</p>
      </div>
    </div>
  `;
};
