'use client';

import { useEffect, useState } from 'react';
import { Loader2, ChevronDown, AlertCircle } from 'lucide-react';

interface GroupeRequiredModalProps {
  isOpen: boolean;
  onClose: (success: boolean) => void;
}

export default function GroupeRequiredModal({ isOpen, onClose }: GroupeRequiredModalProps) {
  const [idGroupe, setIdGroupe] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [groupes, setGroupes] = useState<string[]>([]);
  const [filteredGroupes, setFilteredGroupes] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingGroupes, setLoadingGroupes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les groupes disponibles
  useEffect(() => {
    if (!isOpen) return;

    const fetchGroupes = async () => {
      try {
        setLoadingGroupes(true);
        const response = await fetch('/api/groupes');
        if (response.ok) {
          const data = await response.json();
          const validGroupes = (data.groupes || []).filter(
            (groupe: any) => typeof groupe === 'string' && groupe.trim().length > 0
          );
          setGroupes(validGroupes);
          setFilteredGroupes(validGroupes);
        }
      } catch (err) {
        console.error('Error fetching groupes:', err);
        setError('Erreur lors du chargement des groupes');
      } finally {
        setLoadingGroupes(false);
      }
    };

    fetchGroupes();
  }, [isOpen]);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-combobox]')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  // Filtrer les groupes basé sur la recherche
  useEffect(() => {
    const search = typeof searchInput === 'string' ? searchInput : '';

    if (search.trim() === '') {
      setFilteredGroupes(groupes);
    } else {
      const filtered = groupes.filter((groupe) => {
        if (typeof groupe !== 'string') return false;
        return groupe.toLowerCase().includes(search.toLowerCase());
      });
      setFilteredGroupes(filtered);
    }
  }, [searchInput, groupes]);

  const handleSelectGroupe = (groupe: string) => {
    setIdGroupe(groupe);
    setSearchInput(groupe);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedGroupe = idGroupe.trim();

    if (!trimmedGroupe) {
      setError('Veuillez sélectionner un groupe');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch('/api/profile/update-groupe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code_groupe: trimmedGroupe }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      // Succès - fermer la modal et notifier le parent
      onClose(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur serveur';
      setError(errorMessage);
      console.error('Error updating groupe:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Groupe requis</h2>
              <p className="text-gray-600 mt-2 text-sm">
                Vous devez renseigner votre groupe pour créer une demande.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sélectionnez votre groupe *
            </label>
            <div className="relative" data-combobox>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Rechercher ou sélectionner..."
                  disabled={submitting || loadingGroupes}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100 text-sm"
                  autoFocus
                />
                <ChevronDown className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {loadingGroupes ? (
                    <div className="px-4 py-3 flex items-center justify-center gap-2 text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Chargement...
                    </div>
                  ) : filteredGroupes.length === 0 ? (
                    <div className="px-4 py-3 text-gray-600 text-center text-sm">
                      Aucun groupe trouvé
                    </div>
                  ) : (
                    filteredGroupes.map((groupe) => (
                      <button
                        key={groupe}
                        type="button"
                        onClick={() => handleSelectGroupe(groupe)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-gray-900 font-medium"
                      >
                        {groupe}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !idGroupe.trim()}
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? 'Enregistrement...' : 'Confirmer'}
          </button>
        </form>
      </div>
    </div>
  );
}
