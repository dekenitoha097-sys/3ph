'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import InfoForm from '../../../nouvelle-demande/components/InfoForm';
import ComposantsListSection from '../../../nouvelle-demande/components/ComposantsListSection';
import AddComposantModal from '../../../nouvelle-demande/components/AddComposantModal';

interface Demande {
  id_demande: number;
  titre: string;
  description: string;
  composants: Array<{
    id_ligne: number;
    id_composant: number;
    nom: string;
    reference: string;
    quantite_demandee: number;
    quantite_stock: number;
    photo_lien: string | null;
  }>;
}

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

interface ComposantSelectionne {
  id_composant?: number;
  id_ligne?: number;
  nom: string;
  reference: string;
  quantite_demandee: number;
  image_url?: string | null;
  isNew?: boolean;
}

export default function EditDemandePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user, loading: sessionLoading } = useSession() as { user: any; loading: boolean };

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  const [composants, setComposants] = useState<Composant[]>([]);
  const [composantsSelectionnes, setComposantsSelectionnes] = useState<ComposantSelectionne[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [searchComposant, setSearchComposant] = useState('');
  const [showNewComposantForm, setShowNewComposantForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Nouveaux composants
  const [newComposantNom, setNewComposantNom] = useState('');
  const [newComposantRef, setNewComposantRef] = useState('');
  const [newComposantImage, setNewComposantImage] = useState('');
  const [newComposantDesc, setNewComposantDesc] = useState('');
  const [newComposantQte, setNewComposantQte] = useState('1');

  // Charger les données initiales
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Charger la demande
        const demandeResponse = await fetch(`/api/dashboard/all-demands/${id}`);
        if (!demandeResponse.ok) {
          throw new Error('Demande non trouvée');
        }
        const demandeData = await demandeResponse.json();
        const demande = demandeData.demande as Demande;

        setTitre(demande.titre);
        setDescription(demande.description);

        // Transformer les composants existants
        const composantsExistants = demande.composants.map((c) => ({
          id_composant: c.id_composant,
          id_ligne: c.id_ligne,
          nom: c.nom,
          reference: c.reference,
          quantite_demandee: c.quantite_demandee,
          image_url: c.photo_lien,
          isNew: false,
        }));
        setComposantsSelectionnes(composantsExistants);

        // Charger tous les composants disponibles
        const composantsResponse = await fetch('/api/composants');
        const composantsData = await composantsResponse.json();
        setComposants(composantsData.composants || []);

        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Effacer le message d'erreur après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Ajouter un composant existant
  const handleAddComposant = (composant: Composant) => {
    const alreadyExists = composantsSelectionnes.some(
      (c) => c.id_composant === composant.id_composant
    );
    if (alreadyExists) {
      setError('Ce composant est déjà dans votre demande');
      return;
    }

    setComposantsSelectionnes([
      ...composantsSelectionnes,
      {
        id_composant: composant.id_composant,
        nom: composant.nom,
        reference: composant.reference,
        quantite_demandee: 1,
        image_url: composant.image_url,
        isNew: false,
      },
    ]);
    setShowModal(false);
    setSearchComposant('');
  };

  // Ajouter un nouveau composant
  const handleAddNewComposant = () => {
    if (!newComposantNom || !newComposantRef) {
      setError('Nom et référence requis');
      return;
    }

    setComposantsSelectionnes([
      ...composantsSelectionnes,
      {
        nom: newComposantNom,
        reference: newComposantRef,
        quantite_demandee: parseInt(newComposantQte) || 1,
        image_url: newComposantImage || null,
        isNew: true,
      },
    ]);

    // Réinitialiser le formulaire
    setNewComposantNom('');
    setNewComposantRef('');
    setNewComposantImage('');
    setNewComposantDesc('');
    setNewComposantQte('1');
    setShowNewComposantForm(false);
    setShowModal(false);
    setError('');
  };

  // Retirer un composant
  const handleRemoveComposant = (index: number) => {
    setComposantsSelectionnes(composantsSelectionnes.filter((_, i) => i !== index));
  };

  // Mettre à jour la quantité
  const handleUpdateQuantite = (index: number, quantite: number) => {
    const updated = [...composantsSelectionnes];
    updated[index].quantite_demandee = Math.max(1, quantite);
    setComposantsSelectionnes(updated);
  };

  // Soumettre la demande modifiée
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titre || !description) {
      setError('Titre et description requis');
      return;
    }

    if (composantsSelectionnes.length === 0) {
      setError('Ajoutez au moins un composant');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Séparer composants existants et nouveaux
      const composantsExistants = composantsSelectionnes.filter((c) => !c.isNew);
      const composantsNouveaux = composantsSelectionnes.filter((c) => c.isNew);

      // Étape 1: Créer les nouveaux composants
      const nouveauxIds: Array<{ id_composant: number; quantite_demandee: number }> = [];

      for (const comp of composantsNouveaux) {
        const createResponse = await fetch('/api/composants/custom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: comp.nom,
            reference: comp.reference,
            photo_lien: comp.image_url || null,
            quantite: comp.quantite_demandee,
            commentaire: null,
          }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => ({ error: 'Erreur serveur' }));
          throw new Error(`Erreur création composant ${comp.nom}: ${errorData.error || 'Erreur inconnue'}`);
        }

        const createdComp = await createResponse.json();
        nouveauxIds.push({
          id_composant: createdComp.id_composant,
          quantite_demandee: comp.quantite_demandee,
        });
      }

      // Étape 2: Construire la liste complète des composants
      const tousLesComposants = [
        ...composantsExistants.map((c) => ({
          id_composant: c.id_composant!,
          id_ligne: c.id_ligne,
          quantite_demandee: c.quantite_demandee,
        })),
        ...nouveauxIds.map((c) => ({
          id_composant: c.id_composant,
          quantite_demandee: c.quantite_demandee,
        })),
      ];

      // Étape 3: Mettre à jour la demande via la route PUT
      const response = await fetch(`/api/dashboard/all-demands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre,
          description,
          composants: tousLesComposants,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      router.push(`/dashboard/all-demands/${id}`);
    } catch (err) {
      console.error('Erreur mise à jour demande:', err);
      setError(err instanceof Error ? err.message : 'Erreur serveur');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement de la demande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Modifier la Demande</h1>
          <p className="text-gray-600">Mettez à jour votre demande de composants</p>
        </div>

        {error && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999] bg-red-50 border-2 border-red-400 rounded-lg p-4 text-red-700 max-w-md shadow-2xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InfoForm
            titre={titre}
            setTitre={setTitre}
            description={description}
            setDescription={setDescription}
          />

          <ComposantsListSection
            composants={composantsSelectionnes}
            onAdd={() => setShowModal(true)}
            onRemove={handleRemoveComposant}
            onUpdateQuantite={handleUpdateQuantite}
          />

          {/* Boutons Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={sessionLoading}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || sessionLoading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {submitting ? 'Mise à jour...' : 'Sauvegarder'}
            </button>
          </div>
        </form>

        {/* Modal */}
        <AddComposantModal
          isOpen={showModal && !sessionLoading && !!user}
          composants={composants}
          loading={false}
          searchComposant={searchComposant}
          setSearchComposant={setSearchComposant}
          showNewComposantForm={showNewComposantForm}
          setShowNewComposantForm={setShowNewComposantForm}
          newComposantNom={newComposantNom}
          setNewComposantNom={setNewComposantNom}
          newComposantRef={newComposantRef}
          setNewComposantRef={setNewComposantRef}
          newComposantImage={newComposantImage}
          setNewComposantImage={setNewComposantImage}
          newComposantDesc={newComposantDesc}
          setNewComposantDesc={setNewComposantDesc}
          newComposantQte={newComposantQte}
          setNewComposantQte={setNewComposantQte}
          onAddExisting={handleAddComposant}
          onAddNew={handleAddNewComposant}
          onClose={() => {
            setShowModal(false);
            setShowNewComposantForm(false);
            setSearchComposant('');
          }}
        />
      </div>
    </div>
  );
}
