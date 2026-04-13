
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        
        {/* 404 Number */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Page Non Trouvée
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}