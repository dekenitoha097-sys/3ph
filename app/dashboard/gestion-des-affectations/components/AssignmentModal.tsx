'use client';

import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import SelectWithSearch from './SelectWithSearch';

interface Group {
  id: string;
  name: string;
}

interface Encadrant {
  id: string;
  name: string;
  prenom?: string;
  email?: string;
}

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  encadrants: Encadrant[];
  onAssign: (groupId: string, encadrantId: string) => Promise<void>;
}

export default function AssignmentModal({
  isOpen,
  onClose,
  groups,
  encadrants,
  onAssign
}: AssignmentModalProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedEncadrant, setSelectedEncadrant] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!selectedGroup || !selectedEncadrant) {
      setError('Veuillez sélectionner un groupe et un encadrant');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onAssign(selectedGroup, selectedEncadrant);
      // Reset form
      setSelectedGroup(null);
      setSelectedEncadrant(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'assignation');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Assigner un Encadrant
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <SelectWithSearch
            label="Groupe"
            options={groups.map(g => ({ id: g.id, name: g.name }))}
            value={selectedGroup}
            onChange={(id) => setSelectedGroup(id as string)}
            placeholder="Chercher un groupe..."
          />

          <SelectWithSearch
            label="Encadrant"
            options={encadrants.map(e => ({ 
              id: e.id, 
              name: e.name
            }))}
            value={selectedEncadrant}
            onChange={(id) => setSelectedEncadrant(id as string)}
            placeholder="Chercher un encadrant..."
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleAssign}
            disabled={loading || !selectedGroup || !selectedEncadrant}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Assignation...
              </>
            ) : (
              'Assigner'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
