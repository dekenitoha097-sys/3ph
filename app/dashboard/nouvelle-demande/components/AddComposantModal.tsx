'use client';

import { X } from 'lucide-react';
import ComposantsGrid from './ComposantsGrid';
import NewComposantForm from './NewComposantForm';

interface Composant {
  id_composant: number;
  nom: string;
  reference: string;
  existe: boolean;
  image_url: string | null;
  disponibilite: number;
  description: string;
  statut_disponibilite: string;
  created_at: string;
}

interface AddComposantModalProps {
  isOpen: boolean;
  composants: Composant[];
  loading: boolean;
  searchComposant: string;
  setSearchComposant: (search: string) => void;
  showNewComposantForm: boolean;
  setShowNewComposantForm: (show: boolean) => void;
  newComposantNom: string;
  setNewComposantNom: (nom: string) => void;
  newComposantRef: string;
  setNewComposantRef: (ref: string) => void;
  newComposantImage: string;
  setNewComposantImage: (image: string) => void;
  newComposantDesc: string;
  setNewComposantDesc: (desc: string) => void;
  newComposantQte: string;
  setNewComposantQte: (qte: string) => void;
  onAddExisting: (composant: Composant) => void;
  onAddNew: () => void;
  onClose: () => void;
}

export default function AddComposantModal({
  isOpen,
  composants,
  loading,
  searchComposant,
  setSearchComposant,
  showNewComposantForm,
  setShowNewComposantForm,
  newComposantNom,
  setNewComposantNom,
  newComposantRef,
  setNewComposantRef,
  newComposantImage,
  setNewComposantImage,
  newComposantDesc,
  setNewComposantDesc,
  newComposantQte,
  setNewComposantQte,
  onAddExisting,
  onAddNew,
  onClose,
}: AddComposantModalProps) {
  if (!isOpen) return null;

  const filteredComposants = composants.filter(
    (c) =>
      c.nom.toLowerCase().includes(searchComposant.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchComposant.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Ajouter un composant</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!showNewComposantForm ? (
            <>
              {/* Recherche */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Chercher un composant..."
                  value={searchComposant}
                  onChange={(e) => setSearchComposant(e.target.value)}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message + Bouton Créer Nouveau */}
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-700 mb-3 font-medium">Vous n'avez pas trouvé votre composant ?</p>
                <button
                  type="button"
                  onClick={() => setShowNewComposantForm(true)}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
                >
                  + Ajouter un nouveau composant
                </button>
              </div>

              {/* Grille Composants */}
              <ComposantsGrid composants={filteredComposants} loading={loading} onAdd={onAddExisting} />
            </>
          ) : (
            <NewComposantForm
              nom={newComposantNom}
              setNom={setNewComposantNom}
              reference={newComposantRef}
              setReference={setNewComposantRef}
              image={newComposantImage}
              setImage={setNewComposantImage}
              description={newComposantDesc}
              setDescription={setNewComposantDesc}
              quantite={newComposantQte}
              setQuantite={setNewComposantQte}
              onAdd={onAddNew}
              onCancel={() => setShowNewComposantForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
