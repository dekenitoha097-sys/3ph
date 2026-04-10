'use client';

import { Mail, User, ShieldCheck, Loader2 } from 'lucide-react';

interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  created_at: string;
}

interface UserTableProps {
  utilisateurs: Utilisateur[];
  loading: boolean;
  error: string | null;
}

const getRoleColor = (role: string) => {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    etudiant: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' },
    encadrant: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100' },
    laboratoire: { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100' },
    admin: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100' },
  };
  return colors[role] || { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100' };
};

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    etudiant: 'Étudiant',
    encadrant: 'Encadrant',
    laboratoire: 'Laboratoire',
    admin: 'Admin',
  };
  return labels[role] || role;
};

export default function UserTable({ utilisateurs, loading, error }: UserTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  if (utilisateurs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date d'inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {utilisateurs.map((user) => {
              const roleColor = getRoleColor(user.role);
              return (
                <tr key={user.id_utilisateur} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{user.nom}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.prenom}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 break-all">{user.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${roleColor.badge} ${roleColor.text}`}>
                      <ShieldCheck size={14} />
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden divide-y divide-gray-200">
        {utilisateurs.map((user) => {
          const roleColor = getRoleColor(user.role);
          return (
            <div key={user.id_utilisateur} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{user.nom} {user.prenom}</p>
                  <p className="text-sm text-gray-600 break-all">{user.email}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${roleColor.badge} ${roleColor.text}`}>
                  <ShieldCheck size={12} />
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(user.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer with Count */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
        <p className="text-sm font-medium text-gray-700">
          Total: <span className="text-blue-600 font-bold">{utilisateurs.length}</span> utilisateur(s)
        </p>
      </div>
    </div>
  );
}
