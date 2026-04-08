'use client';

interface HeaderInfoProps {
  titre: string;
  description: string;
  status: string;
  progression: number;
}

export default function HeaderInfo({ titre, description, status, progression }: HeaderInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{titre}</h1>
      <p className="text-base md:text-lg text-gray-600 mb-4">{description}</p>
      
      {/* Status and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <p className="text-sm text-gray-600 font-semibold">Status</p>
          <p className="text-base font-bold text-gray-900 capitalize">{status.replace(/_/g, ' ')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">Progression</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-24 bg-gray-300 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progression}%` }}
              ></div>
            </div>
            <span className="text-base font-bold text-gray-700">{progression}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
