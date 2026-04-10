'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { Loader2, ChevronDown } from 'lucide-react';

interface DashboardGuardProps {
  children: React.ReactNode;
}

export default function DashboardGuard({ children }: DashboardGuardProps) {
  const { user, loading, refreshSession } = useSession();
  const [showModal, setShowModal] = useState(false);
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
    const fetchGroupes = async () => {
      try {
        setLoadingGroupes(true);
        const response = await fetch('/api/groupes');
        if (response.ok) {
          const data = await response.json();
          // Filtrer pour ne garder que les strings valides
          const validGroupes = (data.groupes || []).filter(
            (groupe) => typeof groupe === 'string' && groupe.trim().length > 0
          );
          setGroupes(validGroupes);
          setFilteredGroupes(validGroupes);
        }
      } catch (err) {
        console.error('Error fetching groupes:', err);
      } finally {
        setLoadingGroupes(false);
      }
    };

    fetchGroupes();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Si pas d'id_groupe, afficher la modal
    if (!user?.id_groupe && user?.role === 'etudiant') {
      setShowModal(true);
    }
  }, [user, loading]);

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
    console.log('Form submitted with idGroupe:', { raw: idGroupe, trimmed: trimmedGroupe });

    if (!trimmedGroupe) {
      setError('Veuillez sélectionner un groupe');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = { code_groupe: trimmedGroupe };
      console.log('Sending payload:', payload);

      const response = await fetch('/api/profile/update-groupe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour la session pour obtenir le nouvel id_groupe
      await refreshSession();

      // Réinitialiser le formulaire
      setIdGroupe('');
      setSearchInput('');

      // Fermer la modal - l'utilisateur sera redirigé vers le dashboard
      setShowModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur serveur';
      setError(errorMessage);
      console.error('Error updating groupe:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {children}

      {/* Modal configuration groupe */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Configuration requise</h2>
              <p className="text-gray-600 mt-2 text-sm">
                Veuillez renseigner votre numéro de groupe pour continuer.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Numéro de groupe *
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
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          Aucun groupe trouvé
                        </div>
                      ) : (
                        filteredGroupes.map((groupe) => (
                          <button
                            key={groupe}
                            type="button"
                            onClick={() => handleSelectGroupe(groupe)}
                            className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors text-sm ${
                              idGroupe === groupe ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-gray-900'
                            }`}
                          >
                            {groupe}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {idGroupe && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ Groupe sélectionné: <span className="font-semibold">{idGroupe}</span>
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                💡 Votre numéro de groupe est fourni par votre responsable pédagogique. Il est utilisé pour identifier votre équipe et organiser les demandes de composants.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Enregistrement...' : 'Continuer'}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Vous pouvez modifier ce numéro plus tard dans vos paramètres.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
