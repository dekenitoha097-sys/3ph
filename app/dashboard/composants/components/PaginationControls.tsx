'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  offset: number;
  limit: number;
  total: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLimitChange: (limit: number) => void;
}

export default function PaginationControls({
  offset,
  limit,
  total,
  onPreviousPage,
  onNextPage,
  onLimitChange,
}: PaginationControlsProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const startItem = offset + 1;
  const endItem = Math.min(offset + limit, total);

  const hasMore = offset + limit < total;
  const hasPrevious = offset > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Infos */}
      <div className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">
          {startItem}-{endItem}
        </span>
        <span> sur </span>
        <span className="font-semibold text-gray-900">{total}</span>
        <span> composants</span>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPreviousPage}
          disabled={!hasPrevious}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
          Page {currentPage} / {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={!hasMore}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Limite par page */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Par page:</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
}
