'use client';

import { Tag } from 'lucide-react';

interface ContentStateProps {
  loading: boolean;
  error: string;
  demandesCount: number;
  viewMode: 'table' | 'kanban';
  children: React.ReactNode;
}

export default function ContentState({
  loading,
  error,
  demandesCount,
  viewMode,
  children,
}: ContentStateProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 md:p-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-4 border-blue-600"></div>
        <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 font-medium">Chargement des demandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 md:p-6 text-red-700 text-base md:text-lg">
        {error}
      </div>
    );
  }

  if (demandesCount === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 md:p-16 text-center">
        <Tag size={40} className="md:w-14 md:h-14 mx-auto text-gray-400 mb-4 md:mb-6" />
        <p className="text-base md:text-lg text-gray-600 font-semibold">Aucune demande trouvée</p>
        <p className="text-sm md:text-base text-gray-500 mt-2">Essayez de modifier vos filtres</p>
      </div>
    );
  }

  return <>{children}</>;
}
