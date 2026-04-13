'use client';

import { useEffect, useState, useCallback } from 'react';
import { Users } from 'lucide-react';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import EditRoleModal from './components/EditRoleModal';

interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UtilisateurPage() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: '',
  });

  // Debounce pour la recherche
  const [searchDebounce, setSearchDebounce] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(filters.nom + filters.prenom + filters.email), 300);
    return () => clearTimeout(timer);
  }, [filters.nom, filters.prenom, filters.email]);

  // Fonction pour récupérer les utilisateurs
  const fetchUtilisateurs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (filters.nom) params.append('nom', filters.nom);
      if (filters.prenom) params.append('prenom', filters.prenom);
      if (filters.email) params.append('email', filters.email);
      if (filters.role) params.append('role', filters.role);

      const response = await fetch(`/api/utilisateur?${params.toString()}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du chargement des utilisateurs');
      }

      const data = await response.json();
      setUtilisateurs(data.utilisateurs || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur serveur';
      setError(errorMessage);
      console.error('Error fetching utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.nom, filters.prenom, filters.email, filters.role]);

  // Charger les utilisateurs au montage et quand les filtres changent
  useEffect(() => {
    fetchUtilisateurs();
  }, [fetchUtilisateurs]);

  // Handlers pour les filtres
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      nom: '',
      prenom: '',
      email: '',
      role: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  // Handlers pour l'édition des rôles
  const handleEditUser = (user: Utilisateur) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    // Recharger les utilisateurs après modification
    fetchUtilisateurs();
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Users size={28} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          </div>
          <p className="text-base md:text-lg text-gray-600">
            Gérez et consultez tous les utilisateurs du système
          </p>
        </div>

        {/* Filters */}
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Table */}
        <UserTable
          utilisateurs={utilisateurs}
          loading={loading}
          error={error}
          onEdit={handleEditUser}
        />

        {/* Edit Role Modal */}
        <EditRoleModal
          isOpen={isEditModalOpen}
          utilisateur={editingUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingUser(null);
          }}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
}
