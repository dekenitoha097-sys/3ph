'use client';

import { Calendar, Clock } from 'lucide-react';

interface HistoriqueSectionProps {
  dateSoumission: string;
  dateModification: string;
}

export default function HistoriqueSection({ dateSoumission, dateModification }: HistoriqueSectionProps) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-zinc-50 rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-600 rounded-lg">
          <Clock size={24} className="text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Historique</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-3 rounded-lg bg-white border border-slate-100">
          <Calendar size={20} className="text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Soumise le</p>
            <p className="text-base font-semibold text-gray-900">
              {new Date(dateSoumission).toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-3 rounded-lg bg-white border border-slate-100">
          <Clock size={20} className="text-green-500 flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Modifiée le</p>
            <p className="text-base font-semibold text-gray-900">
              {new Date(dateModification).toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
