'use client';

import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateGroupModalProps) {
  const [formData, setFormData] = useState({
    code_groupe: '',
    filiere: '',
    annee: '',
  });
  const [annees, setAnnees] = useState<any[]>([]);
  const [filieres, setFilieres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anneesRes, filieresRes] = await Promise.all([
          fetch('/api/utils/annee'),
          fetch('/api/utils/filiers'),
        ]);

        const anneesData = await anneesRes.json();
        const filieresData = await filieresRes.json();

        setAnnees(anneesData);
        setFilieres(filieresData);

        if (anneesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            annee: anneesData[0].annee?.toString() || '',
          }));
        }

        if (filieresData.length > 0) {
          setFormData(prev => ({
            ...prev,
            filiere: filieresData[0].filiere || '',
          }));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code_groupe.trim() || !formData.filiere.trim() || !formData.annee) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/utils/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la création du groupe');
      }

      setFormData({
        code_groupe: '',
        filiere: filieres.length > 0 ? filieres[0].filiere || '' : '',
        annee: annees.length > 0 ? annees[0].annee?.toString() || '' : '',
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
            Créer un Groupe
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Code Groupe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code du Groupe *
            </label>
            <input
              type="text"
              name="code_groupe"
              value={formData.code_groupe}
              onChange={handleChange}
              placeholder="ex: GRP-01-A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Filière */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filière *
            </label>
            <select
              name="filiere"
              value={formData.filiere}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || filieres.length === 0}
            >
              <option value="">Sélectionner une filière</option>
              {filieres.map(item => (
                <option key={item.filiere} value={item.filiere}>
                  {item.filiere}
                </option>
              ))}
            </select>
          </div>

          {/* Année */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année
            </label>
            <select
              name="annee"
              value={formData.annee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || annees.length === 0}
            >
              <option value="">Sélectionner une année</option>
              {annees.map(item => (
                <option key={item.annee} value={item.annee?.toString()}>
                  {item.annee}
                </option>
              ))}
            </select>
          </div>
        </form>

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
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Création...
              </>
            ) : (
              'Créer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
