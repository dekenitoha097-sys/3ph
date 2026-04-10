'use client';

import { CheckCircle, Clock, Zap } from 'lucide-react';

interface HeaderInfoProps {
  titre: string;
  description: string;
  status: string;
  progression: number;
}

const getStatusColor = (status: string) => {
  if (!status) return { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100' };
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('soumise')) return { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100' };
  if (statusLower.includes('approuvee') || statusLower.includes('validee')) return { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-100' };
  if (statusLower.includes('rejet')) return { bg: 'bg-red-50', text: 'text-red-600', badge: 'bg-red-100' };
  if (statusLower.includes('en_cours')) return { bg: 'bg-yellow-50', text: 'text-yellow-600', badge: 'bg-yellow-100' };
  return { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100' };
};

export default function HeaderInfo({ titre, description, status, progression }: HeaderInfoProps) {
  const statusColor = getStatusColor(status);
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 md:p-8 border border-blue-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-600 rounded-lg">
          <CheckCircle size={28} className="text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{titre}</h1>
          <p className="text-base md:text-lg text-gray-600">{description}</p>
        </div>
      </div>
      
      {/* Status and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-6 pt-6 border-t border-blue-200">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${statusColor.badge}`}>
            <Zap size={20} className={statusColor.text} />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Status</p>
            <p className={`text-lg font-bold capitalize ${statusColor.text}`}>{status ? status.replace(/_/g, ' ') : 'Non défini'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Zap size={20} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Progression</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg"
                  style={{ width: `${progression}%` }}
                ></div>
              </div>
              <span className="text-lg font-bold text-indigo-600 min-w-fit">{progression}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
