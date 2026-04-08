'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import FilterBar from './components/FilterBar';
import ComposantCard from './components/ComposantCard';
import PaginationControls from './components/PaginationControls';
import EditModal from './components/EditModal';

interface Composant {
  id_composant: number;
  nom: string;
  reference: string;
  image_url: string | null;
  existe: boolean;
  disponibilite: number;
  description: string;
  statut_disponibilite: string;
  created_at: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export default function ComposantsPage() {
  const [composants, setComposants] = useState<Composant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  // Filtres
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [minQuantite, setMinQuantite] = useState('');
  const [maxQuantite, setMaxQuantite] = useState('');
  const [existe, setExiste] = useState('');

  // Modal édition
  const [editingComposant, setEditingComposant] = useState<Composant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; nom: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Debounce pour la recherche
  const [searchDebounce, setSearchDebounce] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Réinitialiser offset quand les filtres changent
  useEffect(() => {
    setPagination((prev) => ({ ...prev, offset: 0 }));
  }, [searchDebounce, status, minQuantite, maxQuantite, existe]);

  // Fonction pour récupérer les composants
  const fetchComposants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchDebounce) params.append('search', searchDebounce);
      if (status) params.append('status', status);
      if (minQuantite) params.append('minQuantite', minQuantite);
      if (maxQuantite) params.append('maxQuantite', maxQuantite);
      if (existe) params.append('existe', existe);

      params.append('limit', pagination.limit.toString());
      params.append('offset', pagination.offset.toString());

      const response = await fetch(`/api/composants/all?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des composants');
      }

      const data = await response.json();
      setComposants(data.composants || []);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur serveur';
      setError(errorMessage);
      console.error('Error fetching composants:', err);
    } finally {
      setLoading(false);
    }
  }, [searchDebounce, status, minQuantite, maxQuantite, existe, pagination.limit, pagination.offset]);

  // Charger les composants au montage et quand les filtres changent
  useEffect(() => {
    fetchComposants();
  }, [fetchComposants]);

  // Handlers pour les filtres
  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setMinQuantite('');
    setMaxQuantite('');
    setExiste('');
  };

  // Handler pour éditer
  const handleEdit = (composant: Composant) => {
    setEditingComposant(composant);
    setIsEditModalOpen(true);
  };

  // Handler pour sauvegarder la modification
  const handleSaveEdit = (updated: Composant) => {
    setComposants((prev) =>
      prev.map((c) => (c.id_composant === updated.id_composant ? updated : c))
    );
    setError(null);
  };

  // Handler pour supprimer
  const handleDelete = (id: number, nom: string) => {
    setDeleteConfirm({ id, nom });
  };

  // Handler pour confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setDeleting(true);
      setDeleteError(null);
      
      const response = await fetch(`/api/composants/${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || 'Erreur lors de la suppression';
        setDeleteError(errorMsg);
        console.error('Delete error:', errorMsg);
        return;
      }

      // Supprimer du state
      setComposants((prev) =>
        prev.filter((c) => c.id_composant !== deleteConfirm.id)
      );
      setDeleteConfirm(null);
      setDeleteError(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur serveur';
      setDeleteError(errorMessage);
      console.error('Error deleting composant:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Handlers pour la pagination
  const handlePreviousPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      offset: 0,
    }));
  };

  // Tri des composants : disponibles en avant, puis par stock décroissant
  const sortedComposants = [...composants].sort((a, b) => {
    // Composants disponibles d'abord
    if (a.statut_disponibilite === 'DIS' && b.statut_disponibilite !== 'DIS') return -1;
    if (a.statut_disponibilite !== 'DIS' && b.statut_disponibilite === 'DIS') return 1;
    
    // Catalog avant custom
    if (a.existe && !b.existe) return -1;
    if (!a.existe && b.existe) return 1;
    
    // Par stock décroissant
    return b.disponibilite - a.disponibilite;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Composants</h1>
          <p className="text-gray-600">
            Découvrez tous les composants disponibles au laboratoire
          </p>
        </div>

        {/* Filtres */}
        <FilterBar
          search={search}
          status={status}
          minQuantite={minQuantite}
          maxQuantite={maxQuantite}
          existe={existe}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onMinQuantiteChange={setMinQuantite}
          onMaxQuantiteChange={setMaxQuantite}
          onExisteChange={setExiste}
          onReset={handleResetFilters}
        />

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium">Erreur: {error}</p>
          </div>
        )}


        {/* Composants */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : composants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">
              Aucun composant trouvé avec ces critères.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-6">
              {sortedComposants.map((composant) => (
                <ComposantCard
                  key={composant.id_composant}
                  {...composant}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <PaginationControls
              offset={pagination.offset}
              limit={pagination.limit}
              total={pagination.total}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              onLimitChange={handleLimitChange}
            />
          </>
        )}

        {/* Modal Édition */}
        <EditModal
          composant={editingComposant}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingComposant(null);
          }}
          onSave={handleSaveEdit}
        />

        {/* Dialog Confirmation Suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirmer la suppression ?
              </h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer le composant{' '}
                <span className="font-semibold">"{deleteConfirm.nom}"</span> ?
              </p>

              {deleteError ? (
                <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded-lg">
                  ❌ {deleteError}
                </p>
              ) : (
                <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded-lg">
                  ⚠️ Cette action est irréversible. Le composant sera complètement supprimé.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeleteConfirm(null);
                    setDeleteError(null);
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  {deleteError ? 'Fermer' : 'Annuler'}
                </button>
                {!deleteError && (
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Suppression...
                      </>
                    ) : (
                      'Supprimer'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
