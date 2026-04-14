'use client';

import { useState } from 'react';
import { X, Loader } from 'lucide-react';

interface EditRoleModalProps {
  isOpen: boolean;
  utilisateur: { id_utilisateur: number; nom: string; prenom: string; role: string; email: string } | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = ['etudiant', 'encadrant', 'laboratoire', 'admin'];

export default function EditRoleModal({ isOpen, utilisateur, onClose, onSuccess }: EditRoleModalProps) {
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = () => {
    if (utilisateur) {
      setNewRole(utilisateur.role);
      setError(null);
    }
  };

  if (isOpen && !newRole && utilisateur) {
    handleOpenModal();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utilisateur || !newRole) {
      setError('Veuillez sélectionner un rôle');
      return;
    }

    if (newRole === utilisateur.role) {
      setError('Le rôle doit être différent du rôle actuel');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/utilisateur/${utilisateur.id_utilisateur}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la modification du rôle');
        return;
      }

      setNewRole('');
      onSuccess();
      onClose();
    } catch (err) {
      setError('Une erreur est survenue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !utilisateur) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Modification du Rôle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Utilisateur</p>
            <p className="font-semibold text-gray-900">
              {utilisateur.prenom} {utilisateur.nom}
            </p>
            <p className="text-sm text-gray-600">{utilisateur.email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau Rôle
            </label>
            <select
              value={newRole}
              onChange={(e) => {
                setNewRole(e.target.value);
                setError(null);
              }}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">-- Sélectionner un rôle --</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Current Role */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
            Rôle actuel: <span className="font-semibold">{utilisateur.role}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Modification...
                </>
              ) : (
                'Modifier'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
